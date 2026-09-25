import { afterEach, test } from "node:test"
import assert from "node:assert/strict"
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { dirname, join } from "node:path"
import { tmpdir } from "node:os"
import {
  acquireSyncLock,
  createDevelopmentCoordinator,
  prepareSyncWorkspace,
  publishArtifacts,
  recoverPublication,
  syncPaths,
  verifyDigiArtifacts,
  writeMarker,
} from "./sync-publication.mjs"
import { parseSnapshotArguments } from "../generation/snapshot-options.mjs"

const roots = []
const fixture = () => {
  const root = mkdtempSync(join(tmpdir(), "digit-publication-"))
  roots.push(root)
  return { root, staging: prepareSyncWorkspace(root) }
}
const put = (root, path, value) => {
  mkdirSync(dirname(join(root, path)), { recursive: true })
  writeFileSync(
    join(root, path),
    typeof value === "string" ? value : JSON.stringify(value)
  )
}
const get = (root, path) => readFileSync(join(root, path), "utf8")
afterEach(() => {
  for (const root of roots.splice(0))
    rmSync(root, { recursive: true, force: true })
})

test("publishes a complete generation and preserves manual files and an omitted shell", () => {
  const { root, staging } = fixture()
  put(root, "generated/old", "old")
  put(root, "manual.ts", "manual")
  put(root, "shell/view.vue", "shell")
  put(staging, "generated/new", "new")
  put(staging, "registry.ts", "new registry")
  publishArtifacts(root, staging, ["generated", "registry.ts"])
  assert.equal(get(root, "generated/new"), "new")
  assert.equal(existsSync(join(root, "generated/old")), false)
  assert.equal(get(root, "manual.ts"), "manual")
  assert.equal(get(root, "shell/view.vue"), "shell")
  assert.equal(existsSync(syncPaths(root).journal), false)
})
for (const failure of [0, 1, 2])
  test(`restores every previous artifact after failure at output ${failure}`, () => {
    const { root, staging } = fixture()
    put(root, "a/file", "old a")
    put(root, "b", "old b")
    put(staging, "a/file", "new a")
    put(staging, "b", "new b")
    put(staging, "new", "created")
    assert.throws(
      () =>
        publishArtifacts(root, staging, ["a", "b", "new"], (_path, index) => {
          if (index === failure) throw new Error("interrupted")
        }),
      /interrupted/
    )
    assert.equal(get(root, "a/file"), "old a")
    assert.equal(get(root, "b"), "old b")
    assert.equal(existsSync(join(root, "new")), false)
  })
test("rejects an incomplete stage before modifying any artifact", () => {
  const { root, staging } = fixture()
  put(root, "a", "old")
  put(staging, "a", "new")
  assert.throws(
    () => publishArtifacts(root, staging, ["a", "missing"]),
    /missing/
  )
  assert.equal(get(root, "a"), "old")
})
test("recovers a journal left by a terminated publication", () => {
  const { root, staging } = fixture()
  put(root, "a", "old")
  renameSync(join(root, "a"), join(staging, "a"))
  put(root, "a", "new")
  put(root, "node_modules/.cache/digit-sync/publication.json", {
    backup: staging,
    entries: [{ path: "a", existed: true }],
  })
  recoverPublication(root)
  assert.equal(get(root, "a"), "old")
})
test("suspends readers once and resumes once when publication releases its lock", async () => {
  const { root } = fixture()
  const events = []
  const reconcile = createDevelopmentCoordinator(root, {
    pause: async () => events.push("pause"),
    resume: async () => events.push("resume"),
  })
  await reconcile()
  put(root, "node_modules/.cache/digit-sync/dev.json", { pid: process.pid })
  const releasePromise = acquireSyncLock(root)
  await reconcile()
  await reconcile()
  const release = await releasePromise
  assert.deepEqual(events, ["resume", "pause"])
  assert.equal(existsSync(syncPaths(root).paused), true)
  release()
  await reconcile()
  await reconcile()
  assert.deepEqual(events, ["resume", "pause", "resume"])
})
test("rejects a second live synchronization", async () => {
  const { root } = fixture()
  const release = await acquireSyncLock(root)
  await assert.rejects(acquireSyncLock(root), /déjà en cours/)
  release()
})
test("creates development markers exclusively", () => {
  const { root } = fixture()
  const marker = syncPaths(root).dev
  writeMarker(marker, { pid: process.pid }, true)
  assert.throws(
    () => writeMarker(marker, { pid: process.pid }, true),
    (error) => error?.code === "EEXIST"
  )
  assert.deepEqual(
    JSON.parse(get(root, "node_modules/.cache/digit-sync/dev.json")),
    { pid: process.pid }
  )
})
test("checks the manifest, paired snapshots and component exports as one generation", () => {
  const { staging } = fixture()
  put(staging, "manifest/manifest.json", {
    orchestrationSha: "abc",
    components: [{ name: "Button" }],
  })
  const snapshots = {
    orchestrationSha: "abc",
    components: {
      Button: {
        slots: [],
        textProps: [],
        defaults: {},
        variants: [{ props: {}, html: "", tree: [] }],
      },
    },
  }
  put(staging, "renderer/src/digicomponents.react.generated.json", snapshots)
  put(
    staging,
    "packages/digicomponents-react/src/snapshots.generated.json",
    snapshots
  )
  put(
    staging,
    "packages/digicomponents-react/src/index.ts",
    'export { Button } from "./components/Button"'
  )
  put(
    staging,
    "packages/digicomponents-react/src/components/Button.tsx",
    "component"
  )
  assert.equal(verifyDigiArtifacts(staging).orchestrationSha, "abc")
  put(staging, "packages/digicomponents-react/src/snapshots.generated.json", {
    ...snapshots,
    orchestrationSha: "different",
  })
  assert.throws(() => verifyDigiArtifacts(staging), /même génération/)
})
test("snapshot CLI accepts either option order and rejects missing paths", () => {
  const expected = { orchestration: "/source", outputRoot: "/stage" }
  assert.deepEqual(
    parseSnapshotArguments([
      "--orchestration",
      "/source",
      "--output-root",
      "/stage",
    ]),
    expected
  )
  assert.deepEqual(
    parseSnapshotArguments([
      "--output-root",
      "/stage",
      "--orchestration",
      "/source",
    ]),
    expected
  )
  assert.throws(
    () =>
      parseSnapshotArguments(["--output-root", "--orchestration", "/source"]),
    /requires a path/
  )
})

import { seedDevelopmentAccount } from "../src/features/auth/development.server"

await seedDevelopmentAccount()
console.log(
  "Compte local dev@digitevent.com créé, propriétaire de l’équipe Digitevent · Développement."
)
process.exit(0)

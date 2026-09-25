import { parseTime as $fae977aafc393c5c$export$c9698ec7f05a07e1 } from "../../../../external/.pnpm/@internationalized_date@3.11.0/external/@internationalized/date/dist/string.js";
import { DateFormatter as $fb18d541ea1ad717$export$ad991b66133851cf } from "../../../../external/.pnpm/@internationalized_date@3.11.0/external/@internationalized/date/dist/DateFormatter.js";
import { useReadonlyConfig } from "../../../../config/composables.js";
import "vue";
function useTimeRangePickerConverters(config) {
  const { timezone, locale } = config || useReadonlyConfig().value.dateConfig;
  const df = new $fb18d541ea1ad717$export$ad991b66133851cf(locale, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
    hour12: false
  });
  function getInputTimeStringFromDate(date) {
    if (!date) return void 0;
    return df.format(date);
  }
  function getDateFromString(value, day) {
    if (!value) return void 0;
    const time = $fae977aafc393c5c$export$c9698ec7f05a07e1(value);
    const dayWithTime = day.set({
      hour: time.hour,
      minute: time.minute,
      second: time.second
    });
    return dayWithTime.toDate(timezone);
  }
  return {
    getInputTimeStringFromDate,
    getDateFromString
  };
}
export {
  useTimeRangePickerConverters
};

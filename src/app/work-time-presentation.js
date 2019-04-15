const WorkTimePresentation = {

  toPresentation: (workTimeSettings, value) => {
    const localizedTimeIdentifiers = getLocalizedTimeIdentifiers();
    if (!value) {
      return localizedTimeIdentifiers.minutes(0);
    }

    const minInHours = 60;

    let days = Math.floor(value / workTimeSettings.minutesADay);
    const weeks = Math.floor(days / workTimeSettings.daysAWeek);
    days %= workTimeSettings.daysAWeek;
    const remainingMinutes = value % workTimeSettings.minutesADay;

    const timeIdentifiersToValuesMap = {
      weeks,
      days,
      hours: Math.floor(remainingMinutes / minInHours),
      minutes: remainingMinutes % minInHours
    };

    const valuableTimeIdentifiers = ['weeks', 'days', 'hours', 'minutes'].
      filter(key => timeIdentifiersToValuesMap[key] !== 0);
    if (!valuableTimeIdentifiers.length) {
      return localizedTimeIdentifiers.minutes(0);
    }

    return valuableTimeIdentifiers.
      map(
        name => localizedTimeIdentifiers[name](timeIdentifiersToValuesMap[name])
      ).join(' ');

    function getLocalizedTimeIdentifiers() {
      return {
        weeks: counter => `${counter}w`,
        days: counter => `${counter}d`,
        hours: counter => `${counter}h`,
        minutes: counter => `${counter}m`
      };
    }
  },

  totalDuration: workItems =>
    (workItems || []).
      map(workItem => workItem.duration.minutes).
      reduce((accumulator, currentValue) => accumulator + currentValue, 0),

  toUTC0: date => Date.UTC(date.getUTCFullYear(),
    date.getUTCMonth(), date.getUTCDate(), 0, 0, 0),

  isToday: timestamp => WorkTimePresentation.toUTC0(new Date()) ===
    timestamp

};

export default WorkTimePresentation;

---
id: bay-rn3s
status: closed
deps: []
links: []
created: 2026-03-18T02:04:44Z
type: feature
priority: 2
assignee: Lars Kellogg-Stedman
---
# Human-friendly schedule parser

## Specification

Write a javascript function that transforms a time specification into a string. Input is of the form:

```
<day> <time> <duration>
```

Where:

`<day>` can be:

- one or more abbreviated day names, separated by commas, indicating that the event happens every week on the given day(s):

     - Mon
     - Mon,Tues
     - Mon,Wed,Fri

 - the literal `*` indicating "every day", meaning the event happens every day of every week at the given time.

 - An ISO-8601 date, indicating a non-repeating event that happens on a single day:

    - 2026-03-14

`<time>` is the 24-hour time in the America/New_York timezone:

- 06:00
- 19:30

`<duration>` is an number with a unit suffix, `m` for minutes, `h` for hours:

- 60m
- 1.5h

The output of this function should be a string of the form:

- "Every Thursday from 6:30pm to 7:00pm"
- "Every day from 8:30am to 9:30am"
- "June 12, 2026 from 12:00pm to 2:00pm"

## Tests

```
[
  {
    "given": "Mon 18:00 60m",
    "expect": "Monday from 6:00pm to 7:00pm"
  },
  {
    "given": "Mon,Wed,Fri 18:00 60m",
    "expect": "Monday, Wednesday, and Friday from 6:00pm to 7:00pm"
  },
  {
    "given": "2026-06-12 12:00 30m",
    "expect": "June 12, 2026 from 12:00pm to 12:30pm"
  },
  {
    "given": "* 20:00 60m"
    "expect": "Every day from 8:00pm to 9:00pm"
  }
]
```


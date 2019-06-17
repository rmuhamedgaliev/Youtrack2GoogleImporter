# Youtrack2GoogleImporter

If you need automatically import data from [Youtrack](https://www.jetbrains.com/youtrack/) to Google Spreadsheet apps, you should use some workarounds. This project help import developer hours monthly. 

Just place this [script to Google Spreadsheet app](https://developers.google.com/apps-script/) and place new formula to the cell. Follow script return developer hours monthly tracked. 🕔

```js
=youtrack(domain, token, author, from, project, timezone)
```

- domain - domain name your youtrack __youtrack.xxxxx.xx__ without protocol
- token - token your youtrack user with reading access [instruction](https://www.jetbrains.com/help/youtrack/standalone/Manage-Permanent-Token.html)
- author - developer username for getting tracked hours
- from - month for import 01.05.2019, need set date format for cell __dd.mm.yyyy__
- project - [project ID](https://www.jetbrains.com/help/youtrack/standalone/Configuring-a-Project.html)
- timezone - timezone in GMT format __GMT+3__

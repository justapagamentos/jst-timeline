# jst-timeline 1.0.0

A smooth timeline
<a hreft="https://codesandbox.io/s/xpxw6k7okw" target="_blank">Live Demo</a>

## Usage

You can simply use calling:
index.js:
```javascript
const data1 = [
  { label: "Em estoque (Recife)", date: "10-04-1995", iconId: 0 },
  { label: "Em estoque (Alpha)", date: "16-04-1995", iconId: 0 },
  { label: "Em manutenção", date: "13-04-1995", iconId: 1 },
  { label: "Em operação no cliente", date: "20-04-1995", iconId: 2 },
  { label: "Entregue ao justo", date: "27-04-1995", iconId: 3 },
  { label: "Em manutenção", date: "30-04-1995", iconId: 1 },
  { label: "Removido", date: "11-04-1995", iconId: 4 }
];

const options = {
  showEmptyDates: false,
  iconClasses: {
    0: "fas fa-layer-group",
    1: "fas fa-wrench",
    2: "fas fa-user-plus",
    3: "far fa-paper-plane",
    4: "fas fa-user-minus"
  }
};

$("#timeline").loadTimeline(data, options);
```
index.html:
```html
<div id="timeline"><div>
```
## data
|key         |Description                     |Required|Type                         |
|------------|--------------------------------|:------:|:---------------------------:|
|label       |The inner text                  |yes     |string                       |
|date        |The date                        |yes     |string (format: 'DD/MM/YYYY')|
|id          |An id for the field             |no      |any                          |
|iconClass   |An clas of an icon for this day |no      |string                       |
|customClass |An class for this day           |no      |string                       |
### iconClass
* The class passed will be the box icon
* If there's an **iconClass** in the box, the **iconClass** will be prioritized over the **iconClasses**
## Options
|key           |Description                  |Required|Type         |Default value|
|--------------|-----------------------------|:------:|:-----------:|:-----------:|
|showEmptyDates|Shows dates without data     |no      |boolean      |null         |
|iconClasses   |The classes of icons         |no      |string       |null         |
|daysClicked   |Add an event for days clicked|no      |Event => void|null         |
### iconClasses
* The key will apply the icon to the iconId's that equals
* If there's an **iconClass** in the box, the **iconClass** will be prioritized

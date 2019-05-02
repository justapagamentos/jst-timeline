# JST timeline

A smooth timeline<br />
[Live Demo](https://codesandbox.io/s/xpxw6k7okw)

## Usage

1. Add the librarys used

- moment@2.24.0
- jquery@3.4.0

```html
<script
  type="text/javascript"
  src="https://code.jquery.com/jquery-3.4.0.min.js"
></script>
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/moment@2.24.0/moment.min.js"
></script>
```

2. Import the js and the style cdn

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@justa/jst-timeline@1.0.32/jst-timeline.css"
/>
<script
  type="text/javascript"
  src="https://unpkg.com/@justa/jst-timeline@1.0.32/jst-timeline.js"
></script>
```

3. Now you can simply use calling:

> index.js:

```javascript
const data = [
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

> index.html:

```html
<div id="timeline"></div>
```

## Reload

You don't need to destroy the timeline. it's already done in loadTimeline function

```javascript
const data2 = [
  { label: "Em estoque (Recife)", date: "10-04-1995", iconId: 0 },
  { label: "Em estoque (Alpha)", date: "16-04-1995", iconId: 0 },
  { label: "Removido", date: "11-04-1995", iconId: 1 }
];

const options2 = {
  showEmptyDates: true,
  iconClasses: {
    0: "fas fa-layer-group",
    1: "fas fa-user-minus"
  }
};

$("#timeline").loadTimeline(data2, options2);
```

## Wanna go to a specific date? No problem!

```javascript
$("#timeline").goToDate("03/11/1990");
```

- This date has to be loaded
- The date that's searched is the formated date on screen

## Wanna add an event? Sure!

Just use jquery events

```javascript
$("#timeline")
  .find(".data")
  .click(e => {
    console.log(e);
  });
// Multiple events
$("#timeline")
  .find(".data")
  .on({
    mouseover: e => {
      console.log(e);
    },
    click: e => {
      console.log(e);
    }
  });
```

## Finish events when it won't be used

It's always a good practice to finish the events when it'll not be used anymore

```javascript
// Just call
$("#timeline").turnOffEvents();
```

## Destroying the timeline

```javascript
$("#timeline").destroyTimeline();
```

## jquery functions

|      Name       | Description                    |  Parameters   |
| :-------------: | ------------------------------ | :-----------: |
|  loadTimeline   | Loads the timeline             | data, options |
|    GoToDate     | scroll to a date               |    string     |
| destroyTimeline | Destroys the timeline          |               |
|  turnoffEvents  | Turnoff timeline jquery events |               |

## data

| key         | Description                          | Required |             Type              |
| ----------- | ------------------------------------ | :------: | :---------------------------: |
| label       | The inner text                       |   yes    |            string             |
| date        | The date                             |   yes    | string (format: 'DD/MM/YYYY') |
| id          | An id for the field                  |    no    |            string             |
| iconId      | Links icon to the key of iconClasses |    no    |            string             |
| iconClass   | An class of an icon for this day     |    no    |            string             |
| customClass | An class for this day                |    no    |            string             |

### iconClass

- The class passed will be the box icon
- If there's an **iconClass** in the box, the **iconClass** will be prioritized over the **iconClasses**

## options

| key            | Description              | Required |  Type   | Default value |
| -------------- | ------------------------ | :------: | :-----: | :-----------: |
| iconClasses    | The classes of icons     |    no    | string  |     null      |
| momentFormat   | Date format for moment   |    no    | string  | 'DD/MM/YYYY'  |
| dataShowFormat | Format on screen         |    no    | string  | 'DD/MM/YYYY'  |
| showEmptyDates | Shows dates without data |    no    | boolean |     false     |
| reverse        | Reverses dates on screen |    no    | boolean |     false     |

### iconClasses

- The key will apply the icon to the iconId's that equals
- If there's an **iconClass** in the box, the **iconClass** will be prioritized

## Icons

To show an icon, it's simple!

Just import an icon library (like fontawesome) and the iconClass or one of the iconClasses that you set will be put in the class property to show the icon!

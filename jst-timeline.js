let timelinesData = {};

/**
 * @description Load calendar with provided data
 * @param {{label: string, date: string, id: any, iconClass: string, customClass: string}[]} data
 * @param {showEmptyDates: boolean, iconClasses: any, momentFormat: string, dataShowFormat: string} options
 */
$.fn.loadTimeline = function(data, options) {
  const { showEmptyDates, iconClasses, reverse } = options;
  let { momentFormat, dataShowFormat } = options;
  momentFormat = momentFormat ? momentFormat : "DD/MM/YYYY";
  dataShowFormat = dataShowFormat ? dataShowFormat : "DD/MM/YYYY";

  const dataToOrder = data;
  let orderedData = [];
  let arr = [];

  if (showEmptyDates) {
    // Verify wich months and years have data
    dataToOrder.forEach(elem => {
      const monthAndYear = moment(elem.date, momentFormat).format("MM/YYYY");
      if (!arr.some(elem => monthAndYear === elem)) arr.push(monthAndYear);
    });

    // Add everydays of months and years with data
    arr.forEach(monthAndYear => {
      const momentD = moment(`01/${monthAndYear}`, "DD/MM/YYYY");
      const days = momentD.daysInMonth();
      let day = 1;
      Array.from({ length: days }, () => {
        const rightDate = momentD.format(dataShowFormat);
        orderedData.push({ date: rightDate });
        day++;
        momentD.date(day);
      });
    });
  }

  if (dataToOrder.length > 1) {
    orderedData = showEmptyDates ? getDate(data) : quickSort(data);
    if (reverse) orderedData = orderedData.reverse();

    orderedData.forEach(elem => {
      if (elem.label) {
        elem.date = toBrasilianDate(elem.date);
        if (iconClasses)
          elem.iconClass = elem.iconClass
            ? elem.iconClass
            : getIcon(elem.iconId);
      }
    });
  } else {
    orderedData = dataToOrder;
    orderedData[0].date = toBrasilianDate(orderedData[0].date);
    // Check if there's a specific icon to the data or search for a icon if not
    if (iconClasses) {
      orderedData[0].iconClass = orderedData[0].iconClass
        ? orderedData[0].iconClass
        : getIcon(orderedData[0].iconId);
    }
  }

  const id = $(this).attr("id");

  // Clears the box before add another
  $(this).destroyTimeine();
  timelinesData[id] = orderedData;

  $(this).attr("class", "timeline-box");

  $(this).append(
    '<div class="line-timeline"></div><ul class="father-box" style="transform: translateX(0px);"></ul>'
  );

  // Add incoming array data to the timeline
  for (let item of orderedData) {
    const { label, date, iconClass, customClass, id } = item;

    if (label) {
      $(this).find(".father-box").append(`
        <li class="data-box${customClass ? ` ${customClass}` : ""}" ${
        iconClass ? "" : 'style="margin-top: 15px;"'
      }${id ? ` id="${id}"` : ""}>
          <div class="data"${id ? ` id="${id}"` : ""}>
          ${
            iconClass
              ? `<span class="${iconClass}" aria-hidden="true"></span><br />`
              : ""
          }
            <b>${label}</b>
          </div>
          <div class="vertical-line"></div>
          <div class="ball"></div>
          <p class="find-date">${date}</p>
        </li>
      `);
    } else if (!label && showEmptyDates) {
      $(this)
        .find(".father-box")
        .append(
          `<li class="empty-day-box""><span class="empty-day${
            isFirstDay(date) ? " empty-first-day" : ""
          }"></span>
        <span class="find-date date hide-date">${date}</span></li>`
        );
    }
  }

  // Handle events
  $(this).turnoffEvents();

  dragEvents(orderedData, this);
  if (showEmptyDates) {
    showHideDatesOnHover(this);
  }

  function isFirstDay(date) {
    const momentDate = moment(date, momentFormat);
    return momentDate.date() === 1;
  }

  /**
   * @description Order array with an quicksort
   * @param {any[]} array
   */
  function quickSort(array) {
    let smaller = [];
    let larger = [];
    if (array.length <= 1) return array;

    const momentDate1 = moment(array[0].date, momentFormat);
    for (let i = 1; i < array.length; i++) {
      const momentDate2 = moment(array[i].date, momentFormat);
      if (momentDate2.isAfter(momentDate1)) {
        larger.push(array[i]);
      }
      if (momentDate2.isSameOrBefore(momentDate1)) {
        smaller.push(array[i]);
      }
    }
    return quickSort(smaller).concat(array[0], quickSort(larger));
  }

  /**
   * @description get date array if this is to show emptyDates
   * @param {any[]} array
   */
  function getDate(array) {
    array.forEach(elem => {
      const find = orderedData.findIndex(searchElem => {
        const momentDate = moment(elem.date, momentFormat);
        const formatedDate = momentDate.format(dataShowFormat);
        return searchElem.date === formatedDate;
      });
      orderedData[find] = elem;
    });
    return orderedData;
  }

  /**
   * @description Change the current date to brasilian format
   * @param {string} date
   */
  function toBrasilianDate(date) {
    return moment(date, momentFormat).format(dataShowFormat);
  }

  /**
   * @description Get correspondent icon to an item
   * @param {string} label
   * @returns class of icon
   */
  function getIcon(iconId) {
    return iconClasses[iconId];
  }

  /** @description Start Drag events */
  function dragEvents(orderedData, context) {
    // Total width of scroll box
    let scrollContentWidth = 0;
    orderedData.forEach((_, i) => {
      const width = context.find(".father-box li").get(i).scrollWidth;
      scrollContentWidth += width;
    });

    // handlers of events
    /**@type {boolean} */
    let canDrag;

    /**@type {number} */
    let lastX = 0;

    context.on({
      mousemove: e => {
        if (canDrag) {
          // get actual width of the box if it's resized and decrement in the max drag width
          const canMove =
            scrollContentWidth - Math.floor($(context).width() * 0.65);
          const maxDragWidth = canMove >= 0 ? canMove : 0;

          const style = $(context)
            .find(".father-box")
            .attr("style");
          const findTransform = style.indexOf("translate");
          const translate = style.substring(findTransform);
          const actualPositionX = Number(translate.replace(/\D/g, ""));

          if (!lastX) lastX = e.pageX;

          const movedValue = Math.abs(lastX) - e.pageX;
          let finalPositionX = Math.abs(actualPositionX + movedValue);
          lastX = e.pageX;

          if (actualPositionX + movedValue <= 0) finalPositionX = 0;
          if (actualPositionX + movedValue >= maxDragWidth)
            finalPositionX = maxDragWidth;

          context
            .find(".father-box")
            .attr("style", `transform: translate(-${finalPositionX}px)`);
        }
      },
      mousedown: e => {
        lastX = e.pageX;
        canDrag = true;
        $(".timeline-box").attr("style", "cursor: grabbing");
      },
      mouseup: _ => {
        canDrag = false;
        $(".timeline-box").attr("style", "cursor: grab");
      },
      mouseleave: _ => {
        canDrag = false;
      }
    });
  }

  /** @description Start show and hide data animation events */
  function showHideDatesOnHover(context) {
    context.find(".empty-day-box").mouseover(function() {
      $(this)
        .find(".date")
        .attr("class", "date show-date");
    });
    context.find(".empty-day-box").mouseleave(function() {
      $(this)
        .find(".date")
        .attr("class", "date hide-date");
    });
  }
};

/**@description Turnoff all events of the timeline */
$.fn.turnoffEvents = function() {
  $(this).off();
};

/**@description Destroys the timeline */
$.fn.destroyTimeine = function() {
  $(this).empty();
  const id = $(this).attr("id");
  delete timelinesData[id];
};

/**@description Go to a passed date */
$.fn.goToDate = function(date) {
  const widthBox = $(this).width();
  const timelineId = $(this).attr("id");
  const timelineData = timelinesData[timelineId];
  let fullScrollWidth = 0;
  let widthUntilDate = 0;

  if (timelineData) {
    timelineData.forEach((_, i) => {
      const width = $(this)
        .find(".father-box li")
        .get(i).scrollWidth;
      fullScrollWidth += width;
    });

    // If can scroll
    if (fullScrollWidth > widthBox) {
      let maxScroll = Math.floor(fullScrollWidth - widthBox);

      $(this)
        .find("li")
        .find(".find-date")
        .each(i => {
          const { innerText, scrollWidth } = $(this)
            .find("li")
            .find(".find-date")
            .get(i);
          if (innerText !== date) {
            widthUntilDate += scrollWidth + 18;
            maxScroll += 54;
          } else {
            if (widthUntilDate > maxScroll) widthUntilDate = maxScroll;
            $(this)
              .find(".father-box")
              .attr(
                "style",
                `transition: transform 0.5s;transform: translate(-${widthUntilDate}px)`
              );
            return;
          }
        });
    }
  }
};

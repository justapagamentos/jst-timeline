/**
 * @description Load calendar with provided data
 * @param {label: string, date: string, id: any, iconClass: string, customClass: string} data
 * @param {showEmptyDates: boolean, iconClasses: any, daysClicked: (e) => void} options
 */
$.fn.loadTimeline = function(data, options) {
  const { showEmptyDates, iconClasses, daysClicked } = options;

  const dataToOrder = data;
  let orderedData = [];
  let monthsAndYears = [];
  let arr = [];

  if (showEmptyDates) {
    // Verify wich months and years hava data
    dataToOrder.forEach(elem => {
      const monthAndYear = moment(elem.date, "DD/MM/YYYY").format("MM/YYYY");
      if (!arr.some(elem => monthAndYear === elem)) arr.push(monthAndYear);
    });

    // Add everydays of months and years with data
    arr.forEach(monthAndYear => {
      const momentD = moment(`01/${monthAndYear}`, "DD/MM/YYYY");
      const days = momentD.daysInMonth();
      let day = 1;
      Array.from({ length: days }, () => {
        const rightDate = momentD.format("DD/MM/YYYY");
        orderedData.push({ date: rightDate });
        day++;
        momentD.date(day);
      });
    });
  }

  /**
   * @description Sort an array from date with simple sort
   * @param {any[]} array
   */
  function sortData(array) {
    if (!array.length) return;
    let alignElem = array[0];
    const momentElem = moment(alignElem.date, "DD-MM-YYYY");
    array.forEach(compareElem => {
      const momentCompareElem = moment(compareElem.date, "DD-MM-YYYY");
      if (momentElem.isAfter(momentCompareElem)) alignElem = compareElem;
    });

    // Edit the data and put in an ordered array
    alignElem.date = toBrasilianDate(alignElem.date);
    // Check if there's a specific icon to the data or search for a icon if not
    if (iconClasses) {
      alignElem.iconClass = alignElem.iconClass
        ? alignElem.iconClass
        : getIcon(alignElem.iconId);
    }

    if (showEmptyDates) {
      const find = orderedData.findIndex(elem => elem.date === alignElem.date);
      orderedData[find] = alignElem;
    } else orderedData.push(alignElem);

    // Removendo item já filtrado do array
    const elemIndex = array.findIndex(elem => elem.date === alignElem.date);
    array.splice(elemIndex, 1);

    // Salva os meses e anos com dados
    const momentAlignData = moment(alignElem.date, "DD/MM/YYYY").date(1);
    if (
      !monthsAndYears.some(monthAndYear => monthAndYear.isSame(momentAlignData))
    )
      monthsAndYears.push(momentAlignData);

    // callback with the array
    sortData(array);
  }
  sortData(dataToOrder);

  /**
   * @description Change the current date to brasilian format
   * @param {string} date
   */
  function toBrasilianDate(date) {
    return moment(date, "DD-MM-YYYY").format("DD/MM/YYYY");
  }

  /**
   * @description Get correspondent icon to an item
   * @param {string} label
   * @returns class of icon
   */
  function getIcon(iconId) {
    return iconClasses[iconId];
  }

  // Clears the box before add another
  $(this).empty();

  $(this).attr("class", "timeline-box");

  $(".timeline-box").append(
    '<div class="line-timeline"></div><ul class="father-box" style="transform: translateX(0px);"></ul>'
  );

  // Add incoming array data to the timeline
  for (let item of orderedData) {
    const { label, date, iconClass, customClass, id } = item;

    if (label) {
      $(".timeline-box ul").append(`
        <li class="data-box${customClass ? ` ${customClass}` : ""}" ${
        iconClass ? "" : 'style="margin-top: 15px;"'
      } ${id ? `id="${id}"` : ""}>
          <span class="data">
          ${
            iconClass
              ? `<span class="${iconClass}" aria-hidden="true"></span><br />`
              : ""
          }
            <b>${label}</b>
          </span>
          <div class="vertical-line"></div>
          <div class="ball"></div>
          <p class="find-date">${date}</p>
        </li>
      `);
    } else if (!label && showEmptyDates) {
      $(".timeline-box ul").append(
        `<li class="empty-day-box""><span class="empty-day${
          isFirstDay(date) ? " empty-first-day" : ""
        }"></span>
        <span class="find-date date hide-date">${date}</span></li>`
      );
    }
  }

  $(this).turnoffEvents();

  dragEvents(orderedData);
  if (showEmptyDates) {
    showHideDatesOnHover();
  }

  // Adds click event on data-box
  if (daysClicked) {
    $(".data-box").click(e => {
      daysClicked(e);
    });
  }

  function isFirstDay(date) {
    const momentDate = moment(date, "DD/MM/YYYY");
    return momentDate.date() === 1;
  }

  /** @description Start Drag events */
  function dragEvents(orderedData) {
    // Total width of scroll box
    let contentWidth = 0;
    orderedData.forEach((_, i) => {
      const width = $(".father-box li").get(i).scrollWidth - 28;
      contentWidth += width;
    });

    // handlers of events
    /**@type {boolean} */
    let canDrag;
    /**@type {number} */
    let lastX = 0;

    $(".timeline-box").on({
      mousemove: e => {
        if (canDrag) {
          const style = $(".father-box").attr("style");
          const actualPositionX = Number(style.replace(/\D/g, ""));

          if (!lastX) lastX = e.pageX;

          const movedValue = Math.abs(lastX) - e.pageX;
          let finalPositionX = Math.abs(actualPositionX + movedValue);
          lastX = e.pageX;

          if (actualPositionX + movedValue <= 0) finalPositionX = 0;
          if (actualPositionX + movedValue >= contentWidth)
            finalPositionX = contentWidth;

          $(".father-box").attr(
            "style",
            `transform: translate(-${finalPositionX}px)`
          );
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
  function showHideDatesOnHover() {
    $(".empty-day-box").mouseover(function() {
      $(this)
        .find(".date")
        .attr("class", "date show-date");
    });
    $(".empty-day-box").mouseleave(function() {
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

/**
 * @description Go to a specific date that's loaded
 * @param {string} date
 */
$.fn.goToDate = function(date) {
  let widthUntilDate = 0;
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
      } else {
        $(this)
          .find(".father-box")
          .attr("style", `transform: translate(-${widthUntilDate}px)`);
        return;
      }
    });
};

var theatres;
var count;
var num;
var body = $("body");
var movietickets = $(".movies__tickets");
var mainHeader = $("header");
var ctx;
var chart;
var startYear = 2007;
var currentYear = moment().format("YYYY");
var numberOfYears = currentYear - startYear;

$(document).ready(function() {

$('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
      &
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          }
        });
      }
    }
  });

  function groupByYear(arr) {
    var groupBy = {};
    $.each(arr, function() {
      groupBy[this.year] = 1 + (groupBy[this.year] || 0);
    });
    return groupBy;
  }

  function createArray(obj) {
    var arr = [];
    Object.keys(obj).forEach(function(key) {
      arr.push({
        year: key,
        count: obj[key]
      });
    });
    return arr;
  }

  $.getJSON("json/movies.json")
    .done(function(json) {
      // Loop through data and output html
      var obj = groupByYear(json);
      var resArray = createArray(obj);
      $.each(json, function(i, item) {
        var date = new Date(0);
        date.setUTCSeconds(item.data_date);
        day = moment(date).format("MMMM Do YYYY");
        movietickets.append(
          "<div class='movies__ticket'>" +
            "<div class='movies__ticket-content'>" +
            "<h3>" +
            item.title +
            "</h3>" +
            "<h4 class='movies__date highlight' data-date='" +
            item.data_date +
            "'>" +
            day +
            "</h4>" +
            "<span class='movies__theatres' data-theatre='" +
            item.theatre +
            "'>" +
            item.theatre +
            "</span>" +
            "</div>" +
          "</div>"
        );
      });
      var years = [];
      var count = [];
      $.each(resArray, function(i, obj) {
        years.push(obj.year);
        count.push(obj.count);
      });
      ctx = document.getElementById("chart").getContext("2d");
      Chart.defaults.global.defaultFontColor = "#d0d0d0";
      chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: years,
          datasets: [
            {
              data: count,
              borderColor: "#d0d0d0",
              pointRadius: 4,
              pointBackgroundColor: "#9689ee",
              pointBorderColor: "rgba(255, 255, 255, 0)",
              backgroundColor: "rgba(255, 255, 255, .0)",
            }
          ]
        },
        maintainAspectRatio: false,
        options: {
          scales: {
            xAxes: [
              {
                gridLines: {
                  color: "rgba(127, 127, 127, .35)"
                }
              }
            ],
            yAxes: [
              {
                gridLines: {
                  color: "rgba(127, 127, 127, .35)"
                },
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          },
          legend: {
            display: false,
          },
          layout: {
            padding: {
              top: 10,
              left: -5,
              right: -5
            }
          }
        }
      });
      chart.aspectRatio = 0;
      // Sort movies by epoch date
      $(".movies__tickets .movies__ticket")
        .sort(function(a, b) {
          return (
            new Date($(".movies__date", b).data("date")) -
            new Date($(".movies__date", a).data("date"))
          );
        })
        .appendTo(".movies__tickets");
      // Count number of movies
      num = $(".movies__ticket").length;
      $("#number-of-movies").html(num);
      // Count theatres
      theatres = [];
      $("span.movies__theatres").each(function() {
        theatres[$(this).attr("data-theatre")] = true;
      });
      count = [];
      for (var i in theatres) {
        count.push(i);
      }
      $("#number-of-theatres").html(count.length);
    })
    .fail(function(jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      console.log("Request Failed: " + err);
    });

  $("#number-of-years").html(numberOfYears);

  mainHeader.headroom({
    offset: 0,
    tolerance: 0,
    classes: {
      pinned: "pinned",
      unpinned: "unpinned",
      top: "onTop",
      bottom: "onBottom",
      notTop: "scrolled"
    },
    onUnpin: function() {
      if (mainHeader.hasClass("open")) {
        mainHeader.removeClass("unpinned");
      }
    },
    onTop: function() {
      mainHeader.removeClass("pinned");
    }
  });
});

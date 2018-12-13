(() => {
  svg = d3
    .select(document.querySelector("#d3-content"))
    .append("svg")
    .attr("width", 400)
    .attr("height", 400)
    .on("click", deselectAll);
  radius = 20;
  positionX = 20;
  positionY = 20;

  function createCircle() {
    const circles = svg
      .datum({
        x: positionX,
        y: positionY,
        selected: false
      })
      .append("circle")
      .attr("cx", positionX)
      .attr("cy", positionY)
      .attr("r", radius)
      .attr("fill", `hsl(${Math.round(Math.random() * 360)},70%,50%)`)
      .attr("transform", `translate(${positionX},${positionY})scale(0)`);

    circles // animate scale
      .transition()
      .duration(500)
      .attr("transform", `translate(${positionX},${positionY}) scale(1)`)
      .attr("cx", positionY)
      .attr("cy", positionY)
      .attr("transform", "scale(1)");

    circles.on("click", function(d, i, e) {
      d3.event.stopPropagation();

      const datum = circles.datum();
      if (e[0].nodeName == "circle") {
        if (circles.datum().selected) {
          datum.selected = false;
          circles
            .datum(datum)
            .transition()
            .duration(200)
            .attr("stroke-width", "0px");
        } else {
          document.querySelector(".remove").disabled = false;
          datum.selected = true;
          d3.select(this)
            .datum(datum)
            .transition()
            .duration(400)
            .attr("stroke", "#455A64")
            .attr("stroke-width", "3px");
        }
      }
      if (allDeselected()) {
        document.querySelector(".remove").disabled = true;
      }
      d3.event.stopPropagation();
    });

    const dragHandler = d3.drag();
    dragHandler
      .on("start", circle => {
        circle.startX = d3.event.x;
        circle.startY = d3.event.y;
      })
      .on("drag", function(circle) {
        document.querySelector(".remove").disabled = false;
        d3.select(this)
          .attr("stroke", "#455A64")
          .attr("stroke-width", "3px");
        if (
          d3.event.x >= 21 &&
          d3.event.x <= 400 - 21 &&
          d3.event.y >= 21 &&
          d3.event.y <= 400 - 21
        ) {
          circle.x = d3.event.x;
          circle.y = d3.event.y;
          d3.select(this).attr(
            "transform",
            `translate(${circle.x - 21},${circle.y - 21}) scale(1)`
          );
        }
        circle.selected = true;
      })
      .on("end", d => {});

    dragHandler(circles);
  }

  function deselectAll() {
    document.querySelector(".remove").disabled = true;
    d3.event.stopPropagation();
    d3.selectAll("circle").each(function(d, i) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("stroke-width", "0px");
      d3.select(this).datum().selected = false;
    });
  }

  document.querySelector(".add").addEventListener("click", () => {
    createCircle();
  });

  document.querySelector(".remove").addEventListener("click", () => {
    d3.selectAll("circle").each(function(d, i) {
      if (d3.select(this).datum().selected == true) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("stroke-width", "0px")
          .remove();
      }
    });
    document.querySelector(".remove").disabled = true;
  });

  function allDeselected() {
    deSelected = true;
    d3.selectAll("circle").each(function(d, i) {
      if (d3.select(this).datum().selected == true) {
        deSelected = false;
      }
    });
    return deSelected;
  }
})();

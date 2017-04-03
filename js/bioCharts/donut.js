/// <reference path="../d3/d3.js" />
var defs;
var arcGroup;
function drawDonut(data, divId, width, height) {

    width = width || 360;
    height = height || 360;


    var pieData = Array();

    var count = 0;
    for (var key in data) {
        if (data.hasOwnProperty(key)) {

            if (pieData[count] == null)
                pieData[count] = Array();

            pieData[count].name = key;
            pieData[count].val = data[key];

            count++;
        }
    }

    addDonut(pieData, divId, width, height);
}




function addDonut(data, divId, width, height)
{
    width = width || 360;
    height = height || 360;

    data.forEach(function (d) {
        d.val = +d.val;
        d.enabled = true;                        // NEW
    });

    var width = width;
    var height = height;
    var radius = (Math.min(width, height) / 2) - 10;
    var donutWidth = 75;
    var legendRectSize = 18;
    var legendSpacing = 4;   
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var svg = d3.select(divId)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) +
        ',' + (height / 2) + ')');

    

    var arc = d3.arc()
       .innerRadius(radius - donutWidth)  // UPDATED
  .outerRadius(radius);

    var pie = d3.pie()
      .value(function (d) { return d.val; })
      .sort(null);


    var tooltip = d3.select(divId)
  .append('div')
  .attr('class', 'chartTooltip');

    tooltip.append('div')
      .attr('class', 'label');

    tooltip.append('div')
      .attr('class', 'count');

    tooltip.append('div')
      .attr('class', 'percent');


    var path = svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function (d, i) {
          return color(d.data.name);
      })
        .each(function (d) { this._current = d; });;

    path.on('mouseover', function (d) {
       
        var total = d3.sum(data.map(function (d) {
            return (d.enabled) ? d.val : 0;     //only count towards total if enabled
        }));
        var percent = Math.round(1000 * d.data.val / total) / 10;
        tooltip.select('.label').html(d.data.name);
        tooltip.select('.count').html(d.data.val);
        tooltip.select('.percent').html(percent + '%');
        tooltip.style('display', 'block');
       
            // Calculate angle bisector
            var ang = d.startAngle + (d.endAngle - d.startAngle) / 2;
            // Transformate to SVG space
            ang = (ang - (Math.PI / 2)) * -1;

            // Calculate a 10% radius displacement
            var x = Math.cos(ang) * radius * 0.05;
            var y = Math.sin(ang) * radius * -0.05;

            d3.select(this).transition()
              .duration(250).attr("transform", "translate(" + x + "," + y + ")");
     

    });                                          

    path.on('mouseout', function (d) {           
        tooltip.style('display', 'none');

        d3.select(this).transition()
                 .duration(150).attr("transform", "translate(0,0)");
    });

    path.on('mousemove', function (d) {
        tooltip.style('top', (d3.event.layerY + 10) + 'px')
          .style('left', (d3.event.layerX + 10) + 'px');
    });
 

    var legend = svg.selectAll('.legend')
  .data(color.domain())
  .enter()
  .append('g')
  .attr('class', 'legend')
  .attr('transform', function (d, i) {
      var height = legendRectSize + legendSpacing;
      var offset = height * color.domain().length / 2;
      var horz = -3 * legendRectSize;
      var vert = i * height - offset;
      return 'translate(' + horz + ',' + vert + ')';
  });


    legend.append('rect')
  .attr('width', legendRectSize)
  .attr('height', legendRectSize)
  .style('fill', color)
  .style('stroke', color)
    .on('click', function (label) {
        
        var rect = d3.select(this);
        var enabled = true;
        var totalEnabled = d3.sum(data.map(function (d) {
            return (d.enabled) ? 1 : 0;
        }));

        if (rect.attr('class') === 'disabled') {
            rect.attr('class', '');
        } else {
            if (totalEnabled < 2) return;
            rect.attr('class', 'disabled');
            enabled = false;
        }

        pie.value(function (d) {           
            if (d.name == label) d.enabled = enabled;
            return (d.enabled) ? d.val : 0;
        });
       
        path = path.data(pie(data));
       
        path.transition()
          .duration(750)
          .attrTween('d', function (d) {
              var interpolate = d3.interpolate(this._current, d);
              this._current = interpolate(0);
              return function (t) {
                  return arc(interpolate(t));
              };
          });
    });

    legend.append('text')
  .attr('x', legendRectSize + legendSpacing)
  .attr('y', legendRectSize - legendSpacing)
  .text(function (d) {return d; });

}

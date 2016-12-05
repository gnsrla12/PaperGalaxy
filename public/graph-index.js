var w = 1000;
var h = 600;
var radius = 20;
var linkDistance = 200;
var colors = d3.scale.category10();
//var database = firebase.database();
//var databaseRef = database.ref();
var svg = d3.select("#graph-index").append("svg").attr({
  "width": w,
  "height": h
});

var dataset = {
  'nodes': [{
    'name': 'Computer Science'
  }, {
    'name': 'Artificial Intelligence'
  }, {
    'name': 'Formal Languages and Automata Theory'
  }, {
    'name': 'Human-Computer Interaction'
  }],
  'edges': [{
    'source': 0,
    'target': 1
  }, {
    'source': 0,
    'target': 2
  }, {
    'source': 0,
    'target': 3
  }, ]
}
var force = d3.layout.force()
  .nodes(dataset.nodes)
  .links(dataset.edges)
  .size([w, h])
  .linkDistance([linkDistance])
  .charge([-500])
  .theta(0.1)
  .gravity(0.05)
  .on("tick", tick)
  .start();

var edges = svg.selectAll("line")
  .data(dataset.edges)
  .enter()
  .append("line")
  .attr("id", function (d, i) {
    return 'edge' + i
  })
  .style("stroke", "#ccc")
  .style("pointer-events", "all")
  .style("stroke-width", "2");

var nodes = svg.selectAll("circle")
  .data(dataset.nodes)
  .enter()
  .append("circle")
  .attr({
    "r": radius
  })
  .on('mouseenter', function (d) {
    document.body.style.cursor = 'pointer';
  })
  .on('mouseleave', function (d) {
    document.body.style.cursor = 'default';
  })
  .attr("class", "dim")
  .style("fill", function (d, i) {
    return colors(i);
  })
  .call(force.drag)


var nodelabels = svg.selectAll(".nodelabel")
  .data(dataset.nodes)
  .enter()
  .append("text")
  .attr({
    "x": function (d) {
      return d.x;
    },
    "y": function (d) {
      return d.y;
    },
    "class": "nodelabel",
    "stroke": "black"
  })
  .on('mouseenter', function (d) {
    document.body.style.cursor = 'pointer';
  })
  .on('mouseleave', function (d) {
    document.body.style.cursor = 'default';
  })
  .text(function (d) {
    return d.name;
  });

var edgepaths = svg.selectAll(".edgepath")
  .data(dataset.edges)
  .enter()
  .append('path')
  .attr({
    'd': function (d) {
      return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y
    },
    'class': 'edgepath',
    'fill-opacity': 0,
    'stroke-opacity': 0,
    'id': function (d, i) {
      return 'edgepath' + i
    }
  })
  .style("pointer-events", "all");

var edgelabels = svg.selectAll(".edgelabel")
  .data(dataset.edges)
  .enter()
  .append('text')
  .style("pointer-events", "all")
  .attr({
    'class': 'edgelabel',
    'id': function (d, i) {
      return 'edgelabel' + i
    },
    'dx': 80,
    'dy': 0,
    'font-size': 10,
    'fill': '#aaa'
  });

edgelabels.append('textPath')
  .attr('xlink:href', function (d, i) {
    return '#edgepath' + i
  })
  .style("pointer-events", "all")
  .text(function (d) {
    return d.label
  });


svg.append('defs').append('marker')
  .attr({
    'id': 'arrowhead',
    'viewBox': '-0 -5 10 10',
    'refX': 25,
    'refY': 0,
    //'markerUnits':'strokeWidth',
    'orient': 'auto',
    'markerWidth': 10,
    'markerHeight': 10,
    'xoverflow': 'visible'
  })
  .append('svg:path')
  .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
  .attr('fill', '#ccc')
  .attr('stroke', '#ccc');


function tick() {
  nodes.attr("r", function (d) {
    if (d.index == 0) {
      return 25;
    }
    else {
      return 20;
    }
  });

  nodes.attr("cx", function (d) {
    if (d.index == 0) {
      return d.x = w / 2;
    }
    else {
      return d.x = Math.max(radius, Math.min(w - radius, d.x));
    }})
       .attr("cy", function (d) {
         if (d.index == 0) {
           return d.y = h / 2;
         }
         else {
           return d.y = Math.max(radius, Math.min(h - radius, d.y));
         }});

  edges.attr({
    "x1": function (d) {
      return d.source.x;
    },
    "y1": function (d) {
      return d.source.y;
    },
    "x2": function (d) {
      return d.target.x;
    },
    "y2": function (d) {
      return d.target.y;
    }
  });

  nodelabels.attr("x", function (d) {
      return d.x;
    })
    .attr("y", function (d) {
      return d.y;
    });

  edgepaths.attr('d', function (d) {
    var path = 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
    return path
  });

  edgelabels.attr('transform', function (d, i) {
    if (d.target.x < d.source.x) {
      bbox = this.getBBox();
      rx = bbox.x + bbox.width / 2;
      ry = bbox.y + bbox.height / 2;
      return 'rotate(180 ' + rx + ' ' + ry + ')';
    } else {
      return 'rotate(0)';
    }
  });


}
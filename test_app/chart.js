var svg = d3.select("svg");
var defs = svg.append('svg:defs');
margin = {top: 0, right: 100, bottom: 40, left: 100};
width = svg.attr("width") - margin.left - margin.right;
height = svg.attr("height") - margin.top - margin.bottom;
categories = ["Against ban", "Waiting on investigation", "Looking into ban", "Anti-gun violence", "Supports ban", "No response"]
var formatValue = d3.format(",d");
var x = d3.scaleLinear()
    .rangeRound([0, width]);
var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var q = d3.queue();

// Queue up multiple data sources to load for graphic
q.defer(d3.json, "responses.json");
q.defer(d3.json, "https://www.texastribune.org/api/v1/politicians/?limit=1000&active=true&office=us-senate&format=json");
q.defer(d3.json, "https://www.texastribune.org/api/v1/politicians/?limit=1000&active=true&office=us-house&format=json");
q.await(drawSwarm);

function partyFormat(party){
  if (party === "democratic") {
    return "Democrat"
  } else if (party === "republican") {
    return "Republican"
  } else {
    return "Other"
  }
}

// Not used?

function type(d) {
  if (!d.response_type) return;
  d.response_type = +d.response_type;
  return d;
}

// Determine circle fill color from party affiliation

function circleColor(d){
  var party = d.data.api_data.party
  if (party === "republican") {
    return "#E55451"
  } else if (party === "democratic") {
    return "#3090C7"
  } else {
    return "gray"
  }
}

// Fill inner circle with candidate image if available using pattern

function imageFill(d){
  if (d.data.api_data.has_photo) {
    var imageUrl = d.data.api_data.headshot
    var imageId = d.data.slug + "-pic"

    defs.append("svg:pattern")
      .attr("id", imageId)
      .attr("width", 20)
      .attr("height", 30)
      .append("svg:image")
      .attr("xlink:href", imageUrl)
      .attr("width", 30)
      .attr("x", 0)
      .attr("y", 0);

    return "url(#"+ imageId + ")"
  } else {
    return "none"
  }
}

// Style and content changes when clicking on cell (which surrounds and is larger than circle)

function cellClick(d){

  // Grab and process relevant data
  statement = d.data.statement
  party = partyFormat(d.data.api_data.party)
  name = d.data.api_data.first_name + " " + d.data.api_data.last_name
  directory_page = d.data.api_data.url

  if (!statement) {
    statement = "Did not respond to request for comment."
  }

  office_short = d.data.api_data.current_office.office
  office = null

  if (office_short === "us-house") {
    office = ", U.S. Representative for District " + d.data.api_data.current_office.division
  } else if (office_short === "us-senate") {
    office = ", U.S. Senator"
  }
  
  bio = d.data.api_data.bio
  
  facebook = null
  websites = d.data.api_data.websites
  for (var i = 0; i < websites.length; i++) {
    var url = websites[i]
    if (url.includes("facebook")) {
      facebook = url;
      break;
    }
  };
  
  twitter = null
  handle = d.data.api_data.twitter
  if (handle) {
    twitter = "https://twitter.com/" + handle;
  }

  events_base_url = "https://www.texastribune.org/api/v1/events/?limit=1000&format=json"
  tag = "person-" + d.data.api_data.slug
  person_events_url = events_base_url + "&tag=" + tag
  q = d3.queue()

  q.defer(d3.json, person_events_url)
  q.await(eventsFormatter)

  // Make style and content changes

  d3.select("#statement").text(statement);
  d3.select("#official-name").text(name);
  d3.select("#party").text(party + office);
  d3.select("#contact").attr("onClick", "window.open('" + directory_page + "');");

  if (twitter){
    d3.select("#twitter").attr("onClick", "window.open('" + twitter + "');");
    d3.select("#twitter").style("visibility", "visible")
  } else {
    d3.select("#twitter").style("visibility", "hidden")
  };

  if (facebook){
    d3.select("#facebook").attr("onClick", "window.open('" + facebook + "');")
    d3.select("#facebook").style("visibility", "visible")
  } else {
    d3.select("#facebook").style("visibility", "hidden")
  };

  if (bio) {
    // clear old
    d3.select("#bio-header").remove()
    d3.select("#bio").remove()

    //set new
    d3.select("#bio-box").append("h4").attr("id", "bio-header").text("Bio")
    d3.select("#bio-box").append("p").attr("id", "bio").text(bio)
  } else {
    //clear old
    d3.select("#bio-header").remove()
    d3.select("#bio").remove()
  }

  d3.select("#person-info").style("visibility", "visible")
  d3.select("#intro").remove()
};

function eventsFormatter(error, event_data){
  if (event_data.count > 0) {
    var events = event_data.results

    title = null
    city = null
    stream_link = null
    event_link = null
    date = null

    // Clear old events
    d3.select("#events-display").remove();
    d3.select("#events-header").remove();

    d3.select("#event-box").append("h4").attr("id", "events-header").text("Events");
    d3.select("#event-box").append("div").attr("id", "events-display");

    for (var i = 0; i < events.length; i++) {
      title = events[i].name
      city = events[i].venue_city + ", " + events[i].venue_state
      stream_link = events[i].livestream_url
      event_link = events[i].eventbrite_url
      date = events[i].display_date + ", " + events[i].starts_at.slice(0, 4)
      
      html_string = "<a href='" + stream_link + "'><p class='event-head'>" + title + "</p></a><p class='event-text'>" + date + " | " + city + "</p><p class='event-text'><a href='"+event_link+"'>Attend</a> | <a href='"+stream_link+"'>Watch</a></p>"
      d3.select("#events-display")
      .append("div")
      .attr("class", "event")
      .html(html_string)

    };
  } else {
    // Clear old events and hide
    d3.select("#events-display").remove();
    d3.select("#events-header").remove();
  }
}

// Process data and draw beeswarm + voronoi chart

function drawSwarm(error, data, senate_data, house_data) {

  // Merge data from senate and house apis into statement data

  var data = data.responses;
  var senate_data = senate_data.results;
  var house_data = house_data.results;

  for (i = 0; i < senate_data.length; i++) {
    for (j = 0; j < data.length; j++) {
      if (data[j].slug === senate_data[i].slug){
        data[j].api_data = senate_data[i];
      };
    };
  };

  for (i = 0; i < house_data.length; i++) {
    for (j = 0; j < data.length; j++) {
      if (data[j].slug === house_data[i].slug){
        data[j].api_data = house_data[i];
      };
    };
  };

  // Draw chart (adapted from https://bl.ocks.org/mbostock/6526445e2b44303eebf21da3b6627320)

  x.domain(d3.extent(data, function(d) { return d.response_type; }))

  var simulation = d3.forceSimulation(data)
      .force("x", d3.forceX(function(d) { return x(d.response_type); }).strength(1))
      .force("y", d3.forceY(height / 2))
      .force("collide", d3.forceCollide(23))
      .stop();

  for (var i = 0; i < 120; ++i) simulation.tick();

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(6).tickFormat(function(d) {return categories[d-1]}));

  var cell = g.append("g")
      .attr("class", "cells")
    .selectAll("g").data(d3.voronoi()
        .extent([[-margin.left, -margin.top], [width + margin.right, height + margin.top]])
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
      .polygons(data)).enter().append("g");

  cell.append("circle")
      .attr("r", 20)
      .attr("cx", function(d) { return d.data.x; })
      .attr("cy", function(d) { return d.data.y; })
      .style("fill", function(d) {return circleColor(d)});
  
  cell.append("circle")
      .attr("r", 15)
      .attr("cx", function(d) { return d.data.x; })
      .attr("cy", function(d) { return d.data.y; })
      .style("fill", function(d) {return imageFill(d)})

  cell.append("path")
      .attr("d", function(d) { return "M" + d.join("L") + "Z"; })
      .on("click", function (d) {cellClick(d)});

  cell.append("title")
      .text(function(d) { return d.data.api_data.first_name + " " + d.data.api_data.last_name; });

};
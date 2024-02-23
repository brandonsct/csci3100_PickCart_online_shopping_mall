const xml2js = require("xml2js");
const axios = require("axios");
const mongoose = require("mongoose");
const EventSchema = require("./schemas.js").EventSchema;
const VenueSchema = require("./schemas.js").VenueSchema;
const Event = mongoose.model("Event", EventSchema);
const Venue = mongoose.model("Venue", VenueSchema);

// mongoose.connect('mongodb://127.0.0.1:27017/project');
mongoose.createConnection("mongodb+srv://longchingkwok:kf5KCtNZsPkT90yx@cluster0.b7xmo7d.mongodb.net/"); // put your own database link here

const db = mongoose.connection;
// Upon connection failure
db.on("error", console.error.bind(console, "Connection error:"));

const getXML = async () => {
  const parser = new xml2js.Parser();
  try {
    const eventsResponse = await axios.get("https://www.lcsd.gov.hk/datagovhk/event/events.xml");
    const venuesResponse = await axios.get("https://www.lcsd.gov.hk/datagovhk/event/venues.xml");
    let event, venue;
    //get latest events and venues
    const eventsResult = await parser.parseString(eventsResponse.data, (err, result) => {
      event = result.events.event;
    });
    const locsResult = await parser.parseString(venuesResponse.data, (err, result) => {
      // console.log("result>>", result.venues.venue)
      venue = result.venues.venue;
    });

    const filteredEvent = event
      .filter(
        (i) =>
          i.$.id !== "" &&
          i.presenterorge[0] !== "" &&
          i.titlee[0] !== "" &&
          i.pricee[0] !== "" &&
          i.predateE[0] !== "" &&
          i.venueid[0] !== ""
      )
      .map((item) => ({
        eventId: parseInt(item.$.id),
        title: item.titlee[0],
        venue: parseInt(item.venueid[0]),
        dateTime: item.predateE[0],
        desc: item.desce[0] ? item.desce[0] : "N/A",
        presenter: item.presenterorge[0],
        price: item.pricee[0],
      }));

    // console.log("filteredEvent>>", filteredEvent)
    // Event.create(filteredEvent)
    //     .then((ven) => console.log("ven>>", ven))
    //     .catch((err) => console.log("err>>", err));
    // dont need to create except for the first time, if desc is undefined, add a 'N/A', other fields shouldnt be undefined

    const locationDict = {};
    for (i of event) {
      if (i.venueid[0] != "" && i.$.id != "") {
        if (locationDict[i.venueid[0]]) {
          locationDict[i.venueid[0]].push(i.$.id);
        } else {
          locationDict[i.venueid[0]] = [i.$.id];
        }
      }
    }
    //location dict to find an array of events in a give location, the events may contain N/A fields

    // console.log("locationDict>>", locationDict)

    const filteredLoc = venue
      .filter(
        (i) =>
          locationDict[i.$.id].length >= 3 &&
          i.venuee[0] !== "" &&
          i.latitude[0] !== "" &&
          i.longitude[0] !== "" &&
          i.$.id !== ""
      )
      .map((i) => ({
        venueId: parseInt(i.$.id),
        venueName: i.venuee[0],
        lat: parseFloat(i.latitude[0]),
        long: parseFloat(i.longitude[0]),
        lut: locationDict[i.$.id],
      }));
    // Venue.create(filteredLoc)
    //   .then((ven) => console.log("ven>>", ven))
    //   .catch((err) => console.log("err>>", err));
    // dont need to create except for the first time, filter the locations that have more than 3 events, ensure none of the field in locations are null, add a lookup table

    // Retrieve existing event and venue data from the database
    const existingEvents = await Event.find();
    const existingVenues = await Venue.find();

    // Check for updated events
    for (const event of filteredEvent) {
      const existingEvent = existingEvents.find((e) => e.eventId === event.eventId);
      if (!existingEvent) {
        console.log("create event");
        await Event.create(event);
      } else {
        // // Update the event if it exists in the database
        // if (event.title !== existingEvent.title || event.venue !== existingEvent.venue || event.dateTime !== existingEvent.dateTime || event.desc !== existingEvent.desc || event.presenter !== existingEvent.presenter || event.price !== existingEvent.price) {
        //   await Event.findByIdAndUpdate(existingEvent._id, event);
        // }
        console.log("exist event, skipping");
      }
    }

    // Check for updated venues
    for (const venue of filteredLoc) {
      const existingVenue = existingVenues.find((v) => v.venueId === venue.venueId);
      if (!existingVenue) {
        // Create a new venue if it doesn't exist in the database
        console.log("create venue");
        await Venue.create(venue);
      } else {
        // Update the venue if it exists in the database
        // if (venue.venueName !== existingVenue.venueName || venue.lat !== existingVenue.lat || venue.long !== existingVenue.long || venue.lut !==existingVenue.lut) {
        //   await Venue.findByIdAndUpdate(existingVenue._id, venue);
        // }
        console.log("exist veue, skipping");
      }
    }
    return true;
  } catch (error) {
    console.log("error>>", error);
    return error;
  }
};

module.exports = {
  getXML,
};

import {onRequest} from "firebase-functions/v2/https";
import fetch from "node-fetch";
import {DOMParser} from "@xmldom/xmldom";

export const parseFeed = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  const showUrl = req.body;

  fetch(showUrl)
    .then((response) => response.text())
    .then((str) => {
      const data = new DOMParser().parseFromString(str, "text/xml");
      const showName =
        data.getElementsByTagName("title")[0].childNodes[0].nodeValue;
      const parsedEpisodes = [];
      const episodes = data.getElementsByTagName("item");
      for (let i = 0; i < episodes.length; i++) {
        parsedEpisodes.push({
          show: showName,
          title:
            episodes[i].getElementsByTagName("title")[0].childNodes[0]
              .nodeValue,
          description:
            episodes[i].getElementsByTagName("itunes:subtitle")[0].childNodes[0]
              .nodeValue,
          url: episodes[i]
            .getElementsByTagName("enclosure")[0]
            .getAttribute("url"),
          duration:
            episodes[i].getElementsByTagName("itunes:duration")[0].childNodes[0]
              .nodeValue,
          cover: episodes[i]
            .getElementsByTagName("itunes:image")[0]
            .getAttribute("href"),
        });
      }

      res.send(parsedEpisodes);
    });
});

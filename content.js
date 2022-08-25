// // @ts-check

// {
//     "tStartMs": 0,
//     "dDurationMs": 7000,
//     "segs": [
//         {
//             "utf8": "Translator: Joseph Geni\nReviewer: Ivana Korom"
//         }
//     ]
// }

var contextkk =
  window.ytInitialPlayerResponse.captions.playerCaptionsTracklistRenderer
    .captionTracks;

var languageCode = "en";
var subUrl = contextkk.find((k) => k.languageCode === languageCode);
var subtitleData;
var subtitleDataTime;
var video;
var divWrap;

async function retry(
  action,
  retryInterval = 5000,
  maxAttemptCount = 3,
  conditions
) {
  const exceptions = [];
  for (let attempted = 0; attempted < maxAttemptCount; attempted++) {
    // console.log('retry', attempted + 1, conditions);
    if (conditions()) {
      console.log("retry done");
      return;
    }
    try {
      if (attempted > 0) {
        await sleep(retryInterval);
      }
      action();
    } catch (e) {
      exceptions.push(e);
    }
  }

  return exceptions;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

var getClosest = (data, value) => {
  const closest = data.reduce(function (prev, curr) {
    return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
  });
  return closest;
};

var turnOffAutoSub = () => {
  clearInterval(window.loopAutoScroll);
};

var turnOnAutoSub = () => {
  if (window.loopAutoScroll) {
    turnOffAutoSub();
  }

  window.loopAutoScroll = setInterval(() => {
    const currentTime = video.currentTime;
    const scrollTo = getClosest(subtitleDataTime, currentTime);

    const liElement = document.getElementById(`seek-youtube_item_${scrollTo}`);
    const liElementAll = document.getElementsByClassName(`seek-youtube_item`);
    for (let i = 0; i < liElementAll.length; i++) {
      const el = liElementAll[i];
      el.style.color = "black";
    }

    liElement.style.color = "red";

    const ofs = liElement.offsetTop;
    if (ofs > 300) {
      divWrap.scrollTop = ofs - 300;
    }
  }, 1000);
};

var makeList = (data) => {
  console.log("makeList", data.length);
  video = document.getElementsByTagName("video")[0];
  // console.log("video", video);
  divWrap = document.getElementById("seek-youtube_wrap");
  // console.log("divWrap1", divWrap);
  if (!divWrap) {
    divWrap = document.createElement("div");
  }
  // console.log("divWrap2", divWrap);

  const ul = document.createElement("ul");

  data.forEach((el) => {
    const { segs = [], tStartMs } = el;
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.append(`${millisToMinutesAndSeconds(tStartMs)}:`);
    span.addEventListener("click", function (ev) {
      video.currentTime = tStartMs / 1000;
    });

    const p = document.createElement("span");
    p.style.marginLeft = "12px";
    p.append(
      ` ${segs
        .map((k) => k.utf8)
        .toString()
        .replaceAll(", ", " ")}`
    );

    li.append(span);
    li.append(p);

    li.id = `seek-youtube_item_${tStartMs / 1000}`;
    li.className = `seek-youtube_item`;
    li.style.cursor = "pointer";
    li.style.paddingBottom = "12px";

    let origColorStyle = li.style.color;
    li.addEventListener("mouseenter", (event) => {
      event.target.style.background = "rgb(233, 229, 229)";
    });
    li.addEventListener("mouseleave", (event) => {
      event.target.style.background = origColorStyle;
    });

    ul.append(li);
  });

  divWrap.innerHTML = ""; // clear all child
  divWrap.append(ul);
  // console.log("divWrap 3", divWrap);

  divWrap.id = "seek-youtube_wrap";
  divWrap.style.height = video.style.height;
  divWrap.style.zIndex = 999;
  divWrap.style.background = "white";
  divWrap.style.top = "80px";
  divWrap.style.right = "0";
  divWrap.style.fontSize = "14px";
  divWrap.style.padding = "24px 24px";
  divWrap.style.marginRight = "24px";
  divWrap.style.overflow = "auto";
  divWrap.style.border = "1px solid";
  divWrap.style.transition = "transform 1s";

  let divSecondary = document.getElementById("secondary");
  divSecondary.prepend(divWrap);

  // start auto jum sub
  turnOnAutoSub();

  divWrap.addEventListener("mouseover", function (ev) {
    turnOffAutoSub();
  });

  divWrap.addEventListener("mouseleave", function (ev) {
    turnOnAutoSub();
  });

  video.addEventListener("ended", function (e) {
    turnOffAutoSub();
  });
};

(async () => {
  try {
    const resData = await fetch(subUrl?.baseUrl + "&fmt=json3").then((res) =>
      res.json()
    );
    // console.log("resData", resData);
    subtitleData = resData?.events;
    subtitleDataTime = resData?.events.map((k) => k.tStartMs / 1000);
  } catch (error) {
    console.log(error);
  }

  if (subtitleData) {
    console.log("runnnn");

    await retry(
      () => {},
      2000,
      50,
      () => {
        return document.getElementById("secondary");
      }
    );
    makeList(subtitleData);
  }
})();

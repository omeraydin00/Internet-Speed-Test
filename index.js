let bitSpeed = document.getElementById("bits"),
  kbSpeed = document.getElementById("kbs"),
  mbSpeed = document.getElementById("mbs"),
  info = document.getElementById("info");

let numTests = 3;

// A large random photo from picsum.photos. The query string makes every request unique,
// so the browser never answers from its cache.
const imageApi = () => `https://picsum.photos/3000/2000?random=${Date.now()}-${Math.random()}`;

// Download one image and return the speed in bits per second.
// The size is measured from the bytes actually received, so it doesn't depend on
// the server sending a content-length header.
async function measureSpeed() {
  const startTime = performance.now();
  const response = await fetch(imageApi(), { cache: "no-store" });
  const blob = await response.blob();
  const endTime = performance.now();

  // Time taken in seconds
  const timeDuration = (endTime - startTime) / 1000;
  // Total bits
  const loadedBits = blob.size * 8;
  return loadedBits / timeDuration;
}

// Run the tests one after another and show the average
const init = async () => {
  info.innerHTML = "Testing...";
  let totalBitSpeed = 0;

  try {
    for (let i = 0; i < numTests; i++) {
      totalBitSpeed += await measureSpeed();
      info.innerHTML = `Testing... ${i + 1}/${numTests}`;
    }
  } catch (error) {
    info.innerHTML = "Test failed. Check your connection and try again.";
    return;
  }

  const averageSpeedInBps = totalBitSpeed / numTests;
  const averageSpeedInKbps = averageSpeedInBps / 1024;
  const averageSpeedInMbps = averageSpeedInKbps / 1024;

  // Display average speeds
  bitSpeed.innerHTML += `${averageSpeedInBps.toFixed(2)}`;
  kbSpeed.innerHTML += `${averageSpeedInKbps.toFixed(2)}`;
  mbSpeed.innerHTML += `${averageSpeedInMbps.toFixed(2)}`;
  info.innerHTML = "Test Completed!";
};

// Run the test when the window loads
window.onload = init;

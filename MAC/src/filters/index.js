// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from "@/utils";

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label;
  }
  return time + label + "s";
}

// 格式化文件大小
export function filterSize(val) {
  if (val < 1024) {
    return val + "B";
  }
  val /= 1024;
  if (val < 1024) {
    return Math.ceil(val) + "KB";
  }
  val /= 1024;
  if (val < 1024) {
    return Math.ceil(val) + "MB";
  }

  return "-";
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time);
  if (between < 3600) {
    return pluralize(~~(between / 60), " minute");
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), " hour");
  } else {
    return pluralize(~~(between / 86400), " day");
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    {
      value: 1e18,
      symbol: "E"
    },
    {
      value: 1e15,
      symbol: "P"
    },
    {
      value: 1e12,
      symbol: "T"
    },
    {
      value: 1e9,
      symbol: "G"
    },
    {
      value: 1e6,
      symbol: "M"
    },
    {
      value: 1e3,
      symbol: "k"
    }
  ];
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (
        (num / si[i].value + 0.1)
          .toFixed(digits)
          .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[i].symbol
      );
    }
  }
  return num.toString();
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0)
    .toString()
    .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","));
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function change(num) {
  if ((num + "").length < 2) {
    return "0" + num;
  } else {
    return num;
  }
}

export function formatTimeSplit(time, split = "-") {
  // let now = new Date(time);
  // let year = now.getFullYear();
  // let month = change(now.getMonth() + 1);
  // let day = change(now.getDate());
  console.log(time);
  
  return time.slice(0, 10);
}

export function formatSize(size) {
  if (size < 1024) return +size.toFixed(2) + "B";
  size = size / 2014;
  if (size < 1024) return +size.toFixed(2) + "KB";
  size = size / 2014;
  if (size < 1024) return +size.toFixed(2) + "MB";
  size = size / 1024;
  if (size < 1024) return +size.toFixed(2) + "GB";
  size = size / 1024;
  if (size < 1024) return +size.toFixed(2) + "TB";
}

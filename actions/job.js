import axios from "axios";
import toZip from "latlng-to-zip";
import qs from "qs";
import { FETCH_JOBS, LIKE_JOB, CLEAR_JOBS } from "./types";

const JOB_QUERY_PARAMS = {
  publisher: "4247371002513736",
  format: "json",
  v: "2",
  latlong: 1
};
const JOB_URL = "http://api.indeed.com/ads/apisearch?";

const buildUrl = (zip, search, radius) => {
  const query = qs.stringify({
    ...JOB_QUERY_PARAMS,
    l: zip,
    radius,
    q: search
  });
  return `${JOB_URL}${query}`;
};

export const fetchJobs = (region, search, radius, cb) => async dispatch => {
  try {
    let zip = await toZip(region);
    const url = buildUrl(zip, search, radius);
    let { data } = await axios.get(url);
    dispatch({ type: FETCH_JOBS, payload: data });
    cb();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

export const likeJob = job => {
  return {
    payload: job,
    type: LIKE_JOB
  };
};

export const clearJobs = () => {
    return {
        type: CLEAR_JOBS
    }
}
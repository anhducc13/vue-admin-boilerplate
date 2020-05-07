import enquireJs from "enquire.js";

const enquireScreen = call => {
  const handler = {
    match: () => {
      call && call(true);
    },
    unmatch: () => {
      call && call(false);
    }
  };
  enquireJs.register("only screen and (max-width: 767.99px)", handler);
};

export default enquireScreen;

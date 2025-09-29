// function which sets the apptheme based on cookie value
export default function setCookies(req, res, next) {
  // 1. if cookie is set, then add a local variable with last visittime data.
  if (req.cookies.appTheme) {
    res.locals.appTheme = req.cookies.appTheme;
    res.cookie("appTheme", req.cookies.appTheme, {
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
  } 
  else {
    res.locals.appTheme = "light";
    res.cookie("appTheme", "light", {
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
  }
  next();
}

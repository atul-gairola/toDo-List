
exports.getDate = () => {
  // Current date
  const date = new Date();

   const options = {
       weekday: "long",
       day:"numeric",
       month:"long"
    };
    // Format Date
    return date.toLocaleDateString('en-US',options) ;
}

exports.getDay = () => {
  // Current date
  const date = new Date();

   const options = {
       weekday: "long",
    };
    // Format Date
    return date.toLocaleDateString('en-US',options) ;
}

/*
place all replicas for Drupal filters here
*/

module.exports = {
  list: [
    {
      name: 'safe_join',
      func: 
        function (value, glue) 
        {
          if(Array.isArray(value))
          {
            return value.join(glue);
          }
          else
          {
            return value;
          }
      }
    },
    {
      name: 't',
      func: 
        function (string, args) {
          return string;
        }
    }
  ]
};
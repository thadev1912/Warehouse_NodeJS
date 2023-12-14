const { createLogger, transports, format } = require('winston');
const {MongoDB} = require('winston-mongodb');
const customerLogger=createLogger({
transports:[
  new transports.File({
    filename:'customer.log',
    level:'info',
    format: format.combine(
      format.timestamp(),
      format.json(),
      format.printf(({ level, message, timestamp,router_name,user_by}) => {       
        return JSON.stringify({ level, message, timestamp,router_name,user_by});
      })
    )
  }),
  new transports.File({
    filename:'customer_error.log',
    level:'error',
    format:format.combine(format.timestamp(),format.json())
  }),
  new MongoDB({
    level: 'info',
    db: 'mongodb://127.0.0.1:27017/mongodb',
    options: { useUnifiedTopology: true },
    collection: 'loggers',
    format: format.combine(
      format.timestamp(),
      format.json(),
      format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
      format.printf((info) => {
        const { level, message, timestamp, metadata } = info;
        const { router_name, user_by } = metadata;
        const logObject = {
          level,
          message,
          timestamp,
          router_name,
          user_by,
          meta: { ...metadata } 
        };
        return JSON.stringify(logObject);
      })
    )
  })
]
});
module.exports = {customerLogger};
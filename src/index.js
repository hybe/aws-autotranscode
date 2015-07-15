/**
 * @api {get} /skeleton API endpoint address
 * @apiName apiName (e.g. accounts)
 * @apiGroup apiGroup (e.g.)
 *
 * @apiParam {String} Paramname (input)
 *
 * @apiSuccess {String} OutputKey 
 */

 console.log('Loading function');

module.exports = exports = {
    handler : function(event, context) {
	if (event.key1 == null) {
	    context.fail(new Error("key1 missing"));
	} else {
	    context.succeed({'key1': event.key1});
	}
    }
};
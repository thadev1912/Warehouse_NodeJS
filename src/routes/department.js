var express = require('express');
var router = express.Router();
const department = require('../app/Controllers/DeparmentController');
const validate=require('../request/DepartmentRequest');
const Auth =require('../app/middlewares/authenticatetion');
const Permision =require('../app/middlewares/authorization');
/**
 * @swagger
 * '/deparment/':
 *  get:
 *     tags:
 *     - Department
 *     summary: Get all department
 *     responses:
 *       200:
 *         description: Get Data Completed!!
 *         content:
 *         application/json:    
 *       
 *       400:
 *         description: Error connecting Database on Server
 * 
 *       403:
 *         description: Authertication
 */
router.get('/listDepartment',Auth.checkAuth,Permision.checkPermision,department.index);
/**
 * @swagger
 * '/deparment/create':
 *  post:
 *     tags:
 *     - Department
 *     summary: Store data department
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - department_code
 *              - department_name
 *            properties:
 *              department_code:
 *                type: string
 *                default: S
 *              department_name:
 *                type: string
 *                default: Salse
 *     responses:
 *      200:
 *        description: Add new field comleted!!!
 *      409:
 *        description: Conflict
 *      404:
 *        description: Error connecting Database on Server
 */
router.post('/storeDepartment',Auth.checkAuth,Permision.checkPermision,validate.checkValidate,department.create);
/**
 * @swagger
 * '/deparment/edit/{id}':
 *  get:
 *     tags:
 *     - Department
 *     summary: Get department by Id Department
 *     parameters:
 *      - name: id
 *        in: path
 *        description: Get department by Id Department
 *        required: true
 *     responses:
 *      200:
 *        description: Infomation Field need to edit!!
 *      400:
 *        description: Error connecting Database on Server
 *      404:
 *        description: Error connecting Database on Server
 */
router.get('/editDepartment/:id',Auth.checkAuth,Permision.checkPermision,department.edit);
/**
 * @swagger
 * '/deparment/update/{id}':
 *  put:
 *     tags:
 *     - Department
 *     summary: Update data department
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The unique id of the hero
 *        required: true
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - department_code
 *              - department_name
 *            properties:
 *              department_code:
 *                type: string
 *                default: S
 *              department_name:
 *                type: string
 *                default: Salse
 *     responses:
 *      200:
 *        description: Add new field comleted!!!
 *      409:
 *        description: Conflict
 *      404:
 *        description: Error connecting Database on Server
 */
router.put('/updateDepartment/:id',Auth.checkAuth,Permision.checkPermision,validate.checkValidate,department.update);
/**
 * @swagger
 * '/deparment/delete/{id}':
 *  delete:
 *     tags:
 *     - Department
 *     summary: Delete department by Id
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The unique id of the hero
 *        required: true
 *     responses:
 *      200:
 *        description: Removed
 *      400:
 *        description: Bad request
 *      404:
 *        description: Not Found
 */
router.delete('/deleteDepartment/:id',Auth.checkAuth,Permision.checkPermision,department.destroy);
router.get('/PaginatewithFind',department.PaginatewithFind);
router.get('/NotificationToClient',Auth.checkAuth,department.NotificationToClient);
module.exports = router;

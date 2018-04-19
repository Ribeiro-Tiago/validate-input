/**
 * @author Tiago Ribeiro - www.tiago-ribeiro.com
 * @description Helper class that handles all the input validation and shows possible informative errors to the end user
 * @see https://github.com/Ribeiro-Tiago/input-validator
 * @copyright MIT license, 2018
 * @version 1.0.0
 */

 (function(){
    'use strict'

    const util = require("utilities-js");

    /**
     * Validates the recieved obj according the validation rules recieved
     * @param {array|object} obj - array or single object with obj (either DOM object or value) to be validated, validation rules and custom error messages (if the user wants)
     * example of what an object would look like: {'input': '}
     * @param {boolean} errorHandle - tells us if we're handling validation errors or not
     * @throws {Error} - throws this exception if arguments are empty
     * @return {boolean} - returns true if every input is valid and false if not
     */
    const validateInputs = function(obj, errorHandle){
        let handleErrors = errorHandle || true;
        
        if (util.isEmpty(obj))
            throw new Error("Invalid arguments!");

        let errors = [];

        /**
         * Checks the validation rules for a certain input and validates it. If need be, adds new entry to errors array
         * @param {string} input - input to validate. Either DOM element or simple value
         * @param {string} rule - validation rule
         * @param {string} message - custom error message
         * @param {number} ruleValue - if the validation needs a value (e.g.: maxvalue, minvalue), this is that value
         * @throws {Error} - throws exception if rule is valid or one of the ruleValues isn't valid
         */
        const validate = function(input, rule, message, ruleValue, optional){
            let inputValue = (input.tagName) ? input.value : input[0].value;
            
            if (optional && util.isEmpty(inputValue))
                return true;

            if (rule === "required")
            {
                if (util.isEmpty(inputValue))
                {
                    errors.push({
                        error: message || "Required field!",
                        input: input
                    });
                }
            }

            else if (rule === "number")
            {
                if (!isNumber(util.inputValue))
                {
                    errors.push({
                        error: message || "Numeric field!",
                        input: input
                    });
                }
            }

            else if (rule === "even")
            {
                if (!util.isEven(inputValue))
                {
                    errors.push({
                        error: message || "Value must be even!",
                        input: input
                    });
                }
            }

            else if (rule === "maxvalue")
            {
                if (!isNumber(util.ruleValue))
                    throw new Error ("Error validating maxvalue: value isn't number!");

                if (parseInt(inputValue) > parseInt(ruleValue))
                {
                    errors.push({
                        error: message || "Value must be below " + ruleValue + "!",
                        input: input
                    });
                }
            }

            else if (rule === "minvalue")
            {
                if (!isNumber(util.ruleValue))
                    throw new Error ("Error validating maxvalue: value isn't number!");
                
                if (parseInt(inputValue) < parseInt(ruleValue))
                {
                    errors.push({
                        error: message || "Value must be above " + ruleValue + "!",
                        input: input
                    });
                }
            }

            else if (rule === "positive")
            {
                if (!util.isPositive(inputValue))
                {
                    errors.push({
                        error: message || "Field must be positive!",
                        input: input
                    });
                }
            }

            else if (rule === "equal")
            {
                let incorrectValue = function(value){
                    return (parseInt(inputValue) !== parseInt(value));
                }

                let different = (isObject(ruleValue)) ? ruleValue.every(incorrectValue) : incorrectValue(ruleValue);
                
                if (different)
                {
                    errors.push({
                        error: message || "Value must be one of the following: " + ruleValue + "!",
                        input: input
                    });
                }
            }

            else if (rule === "maxlen")
            {
                if (inputValue.length > ruleValue)
                {
                    errors.push({
                        error: message || "Maximum value length: " + ruleValue + "!",
                        input: input
                    });
                }
            }
            
            else if (rule === "minlen")
            {
                if (inputValue.length < ruleValue)
                {
                    errors.push({
                        error: message || "Minimum value length: " + ruleValue + "!",
                        input: input
                    });
                }
            }

            else if (rule === "email")
            {
                let regex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
                
                if (!regex.test(inputValue))
                {
                    errors.push({
                        error: message || "Invalid email!",
                        input: input
                    });
                }
            }

            else if (rule === "phone")
            {
                let err = false;

                for (let index in ruleValue){
                    let format = ruleValue[index];
                    if (err)
                        break;

                    for (let i = 0; i < format.length; i++)
                    {
                        if (format[i] !== inputValue[i])
                        {
                            err = true;
                            errors.push({
                                error: message || "Values don't match!",
                                input: input
                            });
                            break;
                        }
                    }
                };
            }

            else 
                throw new Error("Invalid rule: !\n\tInput: " + input.name + "\n\tRule: " + rule);
        };

        /**
         * Goes through obj and rules and calls validate function
         * @param {object} item - object with values (field, rule, etc)
         */
        const parseObj = function(item){
            let rule = item.rule;
            let input = item.input;

            /**
             * Since the input can take up to 3 shapes, we must validate to see which one we're handling and 
             * act acording. If it's an array we've to go throught each one of it's elements, if it's an object
             * we've to access the object elements, if it's neither we simply send the respective values
             * @param {*} input - input we're preparing to validate 
             */
            const parseInput = function(input){
                if (isArray(rule))
                {
                    Array.prototype.forEach.call(rule, function(current, index){
                        validate(input, current.rule, current.message, current.value, current.optional);
                    });
                }
                else if (isObject(rule))
                    validate(input, rule.rule, rule.message, rule.value, rule.optional);
                else
                    validate(input, rule, item.message, item.value, item.optional);
            }
            
            // since it's now possible validate more than one input with the same rules we need 
            // check if we're hanlding a single input or several. If it's several we go throught 
            // each one of them and call the respective function. If not we simply call the function
            if (isArray(input))
            {
                Array.prototype.forEach.call(input, function(current){
                    parseInput(current);
                })
            }
            else 
                parseInput(input);
        }
        
        
        // since it's now possible to send both an array with all objects to be validated or just 
        // a single object to validate, we gotta check which one we're validating. If we're 
        // validating several inputs, we go throught each of them invidually and validate them
        // else we'll simply validate what we recieved
        if (isArray(obj))
        {
            Array.prototype.forEach.call(obj, function(item){
                parseObj(item);
            });
        }
        else
            parseObj(obj);

        // It's also possible that we don't want to handle the errors here, and wanna 
        // do it some other way, if so, we also gotta validate for that
        if (handleErrors)
        {
            // if there are no errors remove any existing error displaying DOM and return true,
            // indicating the inputs are valid
            if (util.isEmpty(errors))
            {
                removeValdiationErrors();
                return true;
            }

            // if not, we handle those DOM those errors and return false,
            // indicating the inputs aren't valid
            handleValidationErrors(errors);

            return false;   
        }
        
        return util.isEmpty(errors);
    };

    /**
     * Creates DOM elements to show validation errors to the user
     * @param {Object} errors - array with the errors: element that failed validation and error
     */
    const handleValidationErrors = function(errors){
        removeValdiationErrors();

        /**
         * Adds class has-error to each element group (parent) for css purposes and 
         * appends the error message to said parent.
         * If there's more than one validation error for the same field, this prevents
         * more than one error to be shown for that field at the same time
         * @param {string} parent 
         */
        let addValidationErrors = function(parent, err){
            if (parent.classList.contains("has-error")) 
            return;
            
            let span = document.createElement("span");
            parent.classList.add("has-error");
            
            span.innerHTML = err;
            parent.appendChild(span);
        }
        
        Array.prototype.forEach.call(errors, function(item, index){
            let getParent = (elem) => {
                return (util.isDOM(elem)) ? elem.parentElement : elem[0].parentElement;
            }

            if (isArray(item.input))
            {
                Array.prototype.forEach.call(item.input, function(input){
                    addValidationErrors(getParent(input), item.error);
                })
            }
            else 
                addValidationErrors(getParent(item.input), item.error);
        });
    };

    /**
     * Removes error DOM elements by removing error-wrapper elements and 
     * has-error class from parent elems
     */
    const removeValdiationErrors = function(){
        let elems = document.getElementsByClassName("error-span");
        
        for (let i = elems.length-1; i >= 0; i--){
            elems[i].parentElement.classList.remove("has-error");
            elems[i].remove();
        };
    };

    window.validateInputs = validateInputs;
})();
/**
 * @jest-environment jsdom
 */

const { notifyUser, init, toDecimal } = require("./script");
const fs = require("fs");
const path = require("path");

describe("User Stories Validation", () => {
    let input;
    let form;

    beforeEach(() => {
        const html = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf8");
        document.body.innerHTML = html;
        input = document.getElementById('binary');
        output = document.getElementById('decimal');
        form = document.getElementById('formConverter');
        global.alert = jest.fn();
        init();
    });
    describe('User can enter up to 8 binary digits in one input field', () => {

        it("should accepts values 0 and 1 without calling alert", () => {
            input.value = '0';
            input.dispatchEvent(new InputEvent('input', { data: '0' }));
            expect(global.alert).not.toHaveBeenCalled();

            input.value = '1';
            input.dispatchEvent(new InputEvent('input', { data: '1' }));
            expect(global.alert).not.toHaveBeenCalled();
        });
        it("should allows deleting characters with backspace without calling alert", () => {
            input.value = '01';
            input.dispatchEvent(new InputEvent('input', { data: '1' }));

            input.value = '0';
            input.dispatchEvent(new InputEvent('input', { data: null }));

            expect(global.alert).not.toHaveBeenCalled();
            expect(input.value).toBe('0');
        });

        it("should allows up to 8 binary digits in one input field", () => {
            input.value = '0000000';
            input.dispatchEvent(new InputEvent('input', { data: '0' }));

            expect(input.value.length).toBeLessThanOrEqual(8);
        });
    })
    describe('User must be notified if anything other than a 0 or 1 was entered', () => {
        it("should call alert with the correct message", () => {
            notifyUser();
            expect(global.alert).toHaveBeenCalledWith("Digite somente 0's ou 1's");
        });
        it("should call alert only once", () => {
            notifyUser();
            expect(global.alert).toHaveBeenCalledTimes(1);
        });
        it("should rejects values other than 0 and 1 and calls alert", () => {
            input.value = '2';
            input.dispatchEvent(new InputEvent('input', { data: '2' }));
            expect(global.alert).toHaveBeenCalled();
        });
        it("should keeps the last valid value after invalid input and calls alert", () => {
            input.value = '0';
            input.dispatchEvent(new InputEvent('input', { data: '0' }));

            input.value = '0a';
            input.dispatchEvent(new InputEvent('input', { data: 'a' }));

            expect(global.alert).toHaveBeenCalled();
            expect(input.value).toBe('0');
        });
    })
    describe('User views the results in a single output field', () => {
        it("should determine the decimal equivalent of a particular binary digit ", () => {
            input.value = '11111111';
            const result = toDecimal(input.value);
            expect(result).toBe(255);
        });
        it("should show a single output field containing the decimal result", () => {
            input.value = '11111111';
            input.dispatchEvent(new InputEvent('input', { data: '1' }));
            form.dispatchEvent(new SubmitEvent("submit"));
            expect(output.value).toBe("255");
        });
        it("should not to submit the form", () => {
            const event = new SubmitEvent("submit");
            const preventSpy = jest.spyOn(event, "preventDefault");
            form.dispatchEvent(event);
            expect(preventSpy).toHaveBeenCalled();
        })
    });
    describe('Bonus features - User can enter a variable number of binary digits', () => {
        it('should convert 11111111 to 255', () => {
            input.value = '11111111';
            const result = toDecimal(input.value);
            expect(result).toBe(255);
        })
        it('should convert 11111 to 31', () => {
            input.value = '11111';
            const result = toDecimal(input.value);
            expect(result).toBe(31);
        })
        it('should convert 111 to 7', () => {
            input.value = '111';
            const result = toDecimal(input.value);
            expect(result).toBe(7);
        })
    })
});
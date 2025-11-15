"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Password = void 0;
class Password {
    constructor(password, isHashed = false) {
        if (!isHashed && !this.isValid(password)) {
            throw new Error('Password must be at least 6 characters long');
        }
        this.value = password;
    }
    isValid(password) {
        return password.length >= 6;
    }
    getValue() {
        return this.value;
    }
}
exports.Password = Password;

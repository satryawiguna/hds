"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Password = void 0;
class Password {
    constructor(password, skipValidation = false) {
        this.minLength = 8;
        if (!skipValidation && !this.isValid(password)) {
            throw new Error(`Password must be at least ${this.minLength} characters long`);
        }
        this.value = password;
    }
    isValid(password) {
        return password.length >= this.minLength;
    }
    toString() {
        return this.value;
    }
    static fromHash(hash) {
        return new Password(hash, true);
    }
}
exports.Password = Password;

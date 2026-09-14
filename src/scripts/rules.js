import Resources from './resources';
import { Patterns } from './settings';

export default {
    email: [
        { pattern: Patterns.email, message: Resources.patterns }
    ],
    mobile: [
        { required: true, message: Resources.required },
        { pattern: Patterns.mobile, message: Resources.patterns }
    ],
    name: [
        { required: true, message: Resources.required },
        { pattern: Patterns.name, message: Resources.patterns }
    ],
    password: [
        { required: true, message: Resources.required },
        { pattern: Patterns.password, message: Resources.patterns }
    ],
    required: [
        { required: true, message: Resources.required }
    ],
    tag: [
        { required: true, message: Resources.required },
        { pattern: Patterns.tag, message: Resources.patterns }
    ],
    userName: [
        { required: true, message: Resources.required },
        { pattern: Patterns.username, message: Resources.patterns }
    ]
};
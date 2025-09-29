// Model to add properties in the template
export default class templateRenderData {
    constructor() {
        this.time = new Date().toString();
    }

    addProperty(name, value) {
        this[name] = value;
    }
}
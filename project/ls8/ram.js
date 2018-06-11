/**
 * RAM access
 */
class RAM {
    constructor(size) {
        this.mem = new Array(size);
        this.mem.fill(0);
    }

    /**
     * Write (store) MDR value at address MAR
     */
    write(MAR, MDR) {
        return this.grab(MAR, MDR, true);
        // !!! IMPLEMENT ME
        // write the value in the MDR to the address MAR
    }

    /**
     * Read (load) MDR value from address MAR
     * 
     * @returns MDR
     */
    read(MAR) {
        return this.grab(MAR, null, false)
        // !!! IMPLEMENT ME
        // Read the value in address MAR and return it
    }
    grab(MAR,MDR, write) {
        if (write) {
            this.mem[MAR] = MDR;
        } else {
            MDR = this.mem[MAR];
        }
    }
}

module.exports = RAM;
/**
 * LS-8 v2.0 emulator skeleton code
 */
const LDI = 0b10011001;
const PRN = 0b01000011;
const HLT = 0b00000001;
const MUL = 0b10101010;
const PUSH = 0b01001101;
const POP = 0b01001100;
const CALL = 0b01001000;
const CMP = 0b10100000;
const JEQ = 0b01010001;
const JNE = 0b01010010;
const JMP = 0b01010000;

const SP = 7;

/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {

    /**
     * Initialize the CPU
     */
    constructor(ram) {
        this.ram = ram;

        this.reg = new Array(8).fill(0); // General-purpose registers R0-R7
        
        // Special-purpose registers
        this.PC = 0; // Program Counter
        this.FL = 0;
        this.pcAdvance = true;
    }

    
    /**
     * Store value in memory address, useful for program loading
     */
    poke(address, value) {
        this.ram.write(address, value);
    }

    /**
     * Starts the clock ticking on the CPU
     */
    startClock() {
        this.clock = setInterval(() => {
            this.tick();
        }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
    }

    /**
     * Stops the clock
     */
    stopClock() {
        clearInterval(this.clock);
    }

    /**
     * ALU functionality
     *
     * The ALU is responsible for math and comparisons.
     *
     * If you have an instruction that does math, i.e. MUL, the CPU would hand
     * it off to it's internal ALU component to do the actual work.
     *
     * op can be: ADD SUB MUL DIV INC DEC CMP
     */
    alu(op, regA, regB) {
        switch (op) {
            case "MUL":
            this.reg[regA] = (this.reg[regB] * this.reg[regA]) & 0xff;
                break;

            case 'CMP':
           if(this.reg[regA] === this.reg[regB]) {
               this.FL = 0b00000001;
           } else {
               this.FL = 0b00000000;
           }
                break;
        }
    }

    /**
     * Advances the CPU one cycle
     */
    tick() {
        // Load the instruction register (IR--can just be a local variable here)
        // from the memory address pointed to by the PC. (I.e. the PC holds the
        // index into memory of the instruction that's about to be executed
        // right now.)
        const IR = this.ram.read(this.PC);
        // !!! IMPLEMENT ME

        // Debugging output
        // console.log(`${this.PC}: ${IR.toString(2)}`);

        // Get the two bytes in memory _after_ the PC in case the instruction
        // needs them.
        const IR2 = this.ram.read(this.PC + 1);
        const IR3 = this.ram.read(this.PC + 2);
        // !!! IMPLEMENT ME

        // Execute the instruction. Perform the actions for the instruction as
        // outlined in the LS-8 spec.
        this.pcAdvance = true;

        switch(IR){

            case LDI:
            this.reg[IR2] = IR3;
            break;

            case PRN:
            console.log(this.reg[IR2]);
            break;

            case HLT:
            this.stopClock();
            break;

            case MUL:
                this.alu("MUL", IR2, IR3);
                break;

            case PUSH:
                this.pushValue(this.reg[IR2]);
            break;

            case CMP: 
               this.alu('CMP', IR2, IR3)
                break;

            // case CALL:
            // this.pushValue(this.PC + 2)
            // break;

            case POP:
            this.reg[IR2] = this.ram.read(this.reg[SP]);
            this.reg[SP]++;
            break;

            case JEQ:
            if (this.FL === 0b00000001) {
            this.PC = this.reg[IR2];
            this.pcAdvance = false;
            }
            break;

            case JNE:
            if (this.FL === 0b00000000) {
            this.PC = this.reg[IR2];
            this.pcAdvance = false;
            }
            break;

            case JMP: 
            this.PC = this.reg[IR2];
            this.pcAdvance = false;
            break;

        default:
        // console.log("unknown instruction:" + IR.toString(2));
        this.stopClock();
        return;
        }

      
        // !!! IMPLEMENT ME

        // Increment the PC register to go to the next instruction. Instructions
        // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
        // instruction byte tells you how many bytes follow the instruction byte
        // for any particular instruction.
        if (this.pcAdvance) {
        const instLen = (IR >> 6) +1;
        this.PC += instLen;
        }
        // !!! IMPLEMENT ME
    }
    pushValue(v) {
        this.reg[SP]--;
        this.ram.write(this.reg[SP], v);
    }
}

module.exports = CPU;

import {Sort} from "./sort";
import {Comparator} from "../interfaces/comparator";

export default function(): void {
    describe("Sort provider", function() {
        beforeEach(function() {
            this.sortInstance = new Sort();
            this.comparator = new TestComparator();
        });

        it("compares according to the current comparator", function() {
            this.sortInstance.comparator = this.comparator;
            expect(this.sortInstance.compare(1, 10)).toBeLessThan(0);
            expect(this.sortInstance.compare(4, 4)).toBe(0);
            expect(this.sortInstance.compare(42, 3)).toBeGreaterThan(0);
        });

        it("can reverse the order of the current comparator", function() {
            this.sortInstance.comparator = this.comparator;
            this.sortInstance.reverse = true;
            expect(this.sortInstance.compare(1, 10)).toBeGreaterThan(0);
            expect(this.sortInstance.compare(4, 4)).toBe(0);
            expect(this.sortInstance.compare(42, 3)).toBeLessThan(0);
        });

        it("exposes a toggle method to set the comparator", function() {
            this.sortInstance.toggle(this.comparator);
            expect(this.sortInstance.comparator).toBe(this.comparator);
        });

        it("reverses the order when toggle is called on the same comparator", function() {
            // Ascending
            this.sortInstance.toggle(this.comparator);
            expect(this.sortInstance.reverse).toBe(false);
            // Descending
            this.sortInstance.toggle(this.comparator);
            expect(this.sortInstance.reverse).toBe(true);
            // Ascending again
            this.sortInstance.toggle(this.comparator);
            expect(this.sortInstance.reverse).toBe(false);
        });

        it("always uses ascending order when toggling a new comparator ", function() {
            this.sortInstance.comparator = this.comparator;
            expect(this.sortInstance.reverse).toBe(false);
            this.sortInstance.toggle(new TestComparator());
            expect(this.sortInstance.reverse).toBe(false);
            this.sortInstance.toggle(this.comparator);
            this.sortInstance.toggle(this.comparator);
            expect(this.sortInstance.reverse).toBe(true);
            this.sortInstance.toggle(new TestComparator());
            expect(this.sortInstance.reverse).toBe(false);
        });

        it("exposes an Observable to follow sort changes", function() {
            let nbChanges = 0;
            let latestComparator: Comparator<number>;
            let latestReverse: boolean;
            this.sortInstance.change.subscribe((sort: Sort) => {
                nbChanges++;
                latestComparator = sort.comparator;
                latestReverse = sort.reverse;
            });
            this.sortInstance.toggle(this.comparator);
            expect(latestComparator).toBe(this.comparator);
            expect(latestReverse).toBe(false);
            this.sortInstance.reverse = true;
            expect(latestComparator).toBe(this.comparator);
            expect(latestReverse).toBe(true);
            this.sortInstance.toggle(this.comparator);
            expect(latestComparator).toBe(this.comparator);
            expect(latestReverse).toBe(false);
            let secondComparator = new TestComparator();
            this.sortInstance.toggle(secondComparator);
            expect(latestComparator).toBe(secondComparator);
            expect(latestReverse).toBe(false);
            expect(nbChanges).toBe(4);
        });
    });
};

class TestComparator implements Comparator<number> {
    compare(a: number, b: number): number {
        return a - b;
    }
}
import { Table } from "../util/table.js";
import { Deficits, Goals, Items } from "../constants.js";

/**
 * A task assigned to a drone
 */
class Job
{
    crop: Items;
    cropThreshold: number;
    doHarvest: Boolean;
    goalTable: Table<Goals>;
    deficitPriority: Array<Deficits>;

    /**
     * @param goalTable A table of goals for each deficit this drone may encounter
     * @param deficitPriority A list of deficits in order of priority
     * @param cropNeeded The crop that this drone would like to collect
     * @param doTileHarvest Whether or not this drone is willing to harvest tiles to obtain crop
     * @param cropThreshold How much crop this drone needs to be content
     */
    constructor(goalTable: Table<Goals>, deficitPriority: Array<Deficits>, cropNeeded: Items, doTileHarvest: Boolean, cropThreshold: number)
    {
        this.crop = cropNeeded;
        this.cropThreshold = cropThreshold;
        this.doHarvest = doTileHarvest
        this.goalTable = goalTable;
        this.deficitPriority = deficitPriority;
    }
}

function JobCitizen()
{
    return new Job(new Table([{ key: Deficits.ENERGY, value: Goals.EAT }]), [Deficits.ENERGY], Items.NONE, false, 0);
}

export { Job, JobCitizen };
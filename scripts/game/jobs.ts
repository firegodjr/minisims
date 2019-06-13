import { Table } from "../util/table.js";
import { Deficits, Goals, Items } from "../constants.js";

/**
 * A task assigned to a drone
 */
class Job
{
    crop: Items;
    crop_threshold: number;
    do_harvest: Boolean;
    goal_table: Table<Goals>;
    deficit_priority: Array<Deficits>;

    /**
     * @param goal_table A table of goals for each deficit this drone may encounter
     * @param deficit_priority A list of deficits in order of priority
     * @param crop_needed The crop that this drone would like to collect
     * @param do_tile_harvest Whether or not this drone is willing to harvest tiles to obtain crop
     * @param crop_threshold How much crop this drone needs to be content
     */
    constructor(goal_table: Table<Goals>, deficit_priority: Array<Deficits>, crop_needed: Items, do_tile_harvest: Boolean, crop_threshold: number)
    {
        this.crop = crop_needed;
        this.crop_threshold = crop_threshold;
        this.do_harvest = do_tile_harvest
        this.goal_table = goal_table;
        this.deficit_priority = deficit_priority;
    }
}

function JobCitizen()
{
    return new Job(new Table([{ key: Deficits.ENERGY, value: Goals.EAT }]), [Deficits.ENERGY], Items.NONE, false, 0);
}

export { Job, JobCitizen };
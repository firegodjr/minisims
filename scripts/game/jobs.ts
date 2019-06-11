import { Table } from "../util/table.js";
import { Deficits, Goals, Items } from "../constants.js";

/**
 * Constructor. A task assigned to a drone.
 * @param {Object} goal_table a table of goals from deficits
 * @param {Array<number>} deficit_priority an array of deficits in order of priority
 * @param {number} crop_needed the crop that a drone with this job can have a deficit in TODO need more crops at once
 * @param {boolean} [do_tile_harvest] whether or not this job requires the drone to personally harvest ripe tiles
 * @param {number} [crop_threshold] the maximum amount of crops that will return a deficit
 * @returns {Job}
 */
class Job
{
    m_crop: Items;
    m_crop_threshold: number;
    m_do_harvest: Boolean;
    m_goal_table: Table<Goals>;
    m_deficit_priority: Array<Deficits>;

    constructor(goal_table: Table<Goals>, deficit_priority: Array<Deficits>, crop_needed: Items, do_tile_harvest: Boolean, crop_threshold: number)
    {
        this.m_crop = crop_needed;
        this.m_crop_threshold = crop_threshold;
        this.m_do_harvest = do_tile_harvest
        this.m_goal_table = goal_table;
        this.m_deficit_priority = deficit_priority;
    }
}

function JobCitizen()
{
    return new Job(new Table([{ key: Deficits.ENERGY, value: Goals.EAT }]), [Deficits.ENERGY], Items.NONE, false, 0);
}

export { Job, JobCitizen };
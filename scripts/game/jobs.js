import { createTable } from "../util/util.js";
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
function Job(goal_table, deficit_priority, crop_needed, do_tile_harvest, crop_threshold)
{
    var self = this;
    self.m_crop = crop_needed;
    self.m_crop_threshold = crop_threshold;
    self.m_do_harvest = do_tile_harvest
    self.m_goal_table = goal_table;
    self.m_deficit_priority = deficit_priority;

    return self;
}

export function JobCitizen()
{
    var self = this;
    self = new Job(createTable([Deficits.ENERGY], [Goals.EAT]), [Deficits.ENERGY], Items.NONE);
    return self;
}
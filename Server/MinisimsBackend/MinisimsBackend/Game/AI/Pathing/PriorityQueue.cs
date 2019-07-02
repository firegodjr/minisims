using System;
using System.Collections.Generic;

// Personal Implentation of a priority queue
public class PriorityQueue<T> where T : IComparable<T>
{
    // List
    private List<T> data;
    // constructor
    public PriorityQueue()
    {
        data = new List<T>();
    }
    // Gets the count of the queue
    public int Count => data.Count;
    /// <summary>
    /// Adds element to the list
    /// </summary>
    /// <param name="item">Item to add</param>
    public void Enqueue(T item)
    {
        // No Heaps or Queues in C#
        // So using the next best thing
        // With the best recommended fastest sorting.
        // Allows for duplicate "keys"
        var index = data.BinarySearch(item);
        if (index < 0) index = ~index;
        data.Insert(index, item);
    }

    public List<T> GetList()
    {
        return data;
    }

    /// <summary>
    /// remove an object
    /// </summary>
    /// <returns>object removed</returns>
    public T Dequeue()
    {
        // try to delete
        try
        {
            // get first item
            T item = data[0];
            // delete it from list
            data.Remove(item);
            // return it
            return item;
        }
        // catch exeption if is not there
        catch (NullReferenceException)
        {
            // return empty item
            return default(T);
        }
    }
}
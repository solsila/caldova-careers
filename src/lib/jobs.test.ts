import { describe, it, expect } from 'vitest';
import { sortByNewest, formatPostedDate, filterJobs } from './jobs';
import type { Job } from '../types/job';

function makeJob(
    slug: string,
    postedDate: string,
    department = 'Technology',
    location = 'Remote',
): Job {
    return {
        slug,
        title: `Role ${slug}`,
        department,
        location,
        type: 'Full-time',
        remote: true,
        postedDate,
        summary: 'A role.',
    };
}

describe('sortByNewest', () => {
    it('orders jobs by posted date, newest first', () => {
        const jobs = [
            makeJob('a', '2027-01-01'),
            makeJob('b', '2027-03-15'),
            makeJob('c', '2027-02-10'),
        ];
        expect(sortByNewest(jobs).map((j) => j.slug)).toEqual(['b', 'c', 'a']);
    });

    it('does not mutate the input array', () => {
        const jobs = [makeJob('a', '2027-01-01'), makeJob('b', '2027-03-15')];
        const original = jobs.map((j) => j.slug);
        sortByNewest(jobs);
        expect(jobs.map((j) => j.slug)).toEqual(original);
    });
});

describe('filterJobs', () => {
    const jobs = [
        makeJob('technology-remote', '2027-01-01', 'Technology', 'Remote'),
        makeJob('technology-office', '2027-01-02', 'Technology', 'Boston, MA, USA'),
        makeJob('finance-remote', '2027-01-03', 'Finance', 'Remote'),
    ];

    it('filters by department', () => {
        expect(filterJobs(jobs, 'Technology', '').map((job) => job.slug)).toEqual([
            'technology-remote',
            'technology-office',
        ]);
    });

    it('filters by location', () => {
        expect(filterJobs(jobs, '', 'Remote').map((job) => job.slug)).toEqual([
            'technology-remote',
            'finance-remote',
        ]);
    });

    it('combines department and location filters with AND', () => {
        expect(filterJobs(jobs, 'Technology', 'Remote').map((job) => job.slug)).toEqual([
            'technology-remote',
        ]);
        expect(filterJobs(jobs, 'Finance', 'Boston, MA, USA')).toEqual([]);
    });

    it('returns all roles when filters are cleared', () => {
        expect(filterJobs(jobs, '', '').map((job) => job.slug)).toEqual([
            'technology-remote',
            'technology-office',
            'finance-remote',
        ]);
        expect(filterJobs([], '', '')).toEqual([]);
    });
});

describe('formatPostedDate', () => {
    it('formats an ISO date as a readable string', () => {
        expect(formatPostedDate('2027-01-05')).toBe('January 5, 2027');
    });

    it('returns the raw value when the date is unparseable', () => {
        expect(formatPostedDate('not-a-date')).toBe('not-a-date');
    });
});

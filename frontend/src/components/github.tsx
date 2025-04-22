// src/GitHubRepoStats.tsx
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Label,
} from "recharts";

import {
  getGitHubCommitDataQueryOptions,
  getGitHubCodeFrequencyQueryOptions,
} from "@/api/githubApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const COLORS = ["#1E3A8A", "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE"];

const formatNumberForAxis = (num: number) => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`; // Format positive numbers over 1,000
  } else if (num <= -1000) {
    return `${(num / 1000).toFixed(1)}k`; // Format negative numbers under -1,000
  }
  return num.toString(); // Return numbers between -999 and 999 as-is
};

export function GitHubRepoCommitData() {
  const { isPending, error, data } = useQuery(getGitHubCommitDataQueryOptions);

  if (error) return "An error has occurred: " + error.message;

  const processWeeklyData = (data: { week: number; total: number }[]) => {
    return data
      .filter((activity) => activity.total > 0) // Only include weeks with commits
      .map((activity) => ({
        week: new Date(activity.week * 1000).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        }), // Format as MMM-DD
        total: activity.total,
      }));
  };

  return (
    <>
      <h2>Weekly Commits</h2>
      {!isPending ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={processWeeklyData(data)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" tick={{ fontSize: 13 }} />
            <YAxis tickFormatter={formatNumberForAxis} tick={{ fontSize: 13 }}>
              <Label value="Contributions" angle={-90} position="center" fontSize={13} />
            </YAxis>
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              stroke={COLORS[1]}
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-red-500 hover:underline">Error retrieving commit data.</div>
      )}
    </>
  );
}

export function GitHubRepoCodeFrequency() {
  const { isPending, error, data } = useQuery(getGitHubCodeFrequencyQueryOptions);

  if (error) return "An error has occurred: " + error.message;

  const processCodeFrequency = (data: [number, number, number][]) => {
    return data.map(([date, additions, deletions]) => ({
      week: new Date(date * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      }), // Format as MMM-DD
      additions,
      deletions,
    }));
  };

  return (
    <>
      <h2>Code Frequency</h2>
      {!isPending ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={processCodeFrequency(data)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" tick={{ fontSize: 13 }} />
            <YAxis tickFormatter={formatNumberForAxis} tick={{ fontSize: 13 }}>
              <Label value="Contributions" angle={-90} position="center" fontSize={13} />
            </YAxis>
            <Tooltip />
            <Line
              type="monotone"
              dataKey="deletions"
              stroke="#FF0000"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="additions"
              stroke={COLORS[1]}
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-red-500 hover:underline">Error retrieving frequency data.</div>
      )}
    </>
  );
}

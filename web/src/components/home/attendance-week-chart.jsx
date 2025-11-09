"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "../ui/skeleton";

export const description = "A bar chart";

const chartData = [
  { month: "January", minutes: 186 },
  { month: "February", minutes: 305 },
  { month: "March", minutes: 237 },
  { month: "April", minutes: 73 },
  { month: "May", minutes: 209 },
  { month: "June", minutes: 214 },
];

const chartConfig = {
  minutes: {
    label: "minutes",
    color: "#0079CE",
  },
};

export function ChartBarTodayAttendance({ data, loading }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Энэ долоо хоногын ирсэн минут</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-2/4" />
            <Skeleton className="h-5 w-full" />
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={data}>
                  <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="minutes" fill="var(--color-minutes)" radius={8} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Энэ долоо хоногын нийт ирсэн минутын тоог харуулж байна
        </div>
      </CardFooter>
    </Card>
  );
}
        

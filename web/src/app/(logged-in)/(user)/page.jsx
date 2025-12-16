import { AttendanceToday } from "components/home/attendance-today";
import { AttendenceWeek } from "components/home/attendence-week";
import { AvgDuration } from "components/home/avg-duration";
export default function Page() {
  return (
    <div className="flex flex-col gap-6 ">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Тавтай морилно уу!
        </h1>
        <p className="text-muted-foreground">
          Эрц, статистик болон бусад мэдээллийг эндээс харна уу.
        </p>
      </div>

      <div className="">
        <div className="flex flex-row flex-wrap gap-6">
          <AttendanceToday />
          <AttendenceWeek />
          <AvgDuration />
        </div>
      </div>
    </div>
  );
}

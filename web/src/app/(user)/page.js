import Image from "next/image";
import {AttendanceToday} from "components/home/attendance-today"

export default function Home() {
  return (
    <div className="flex flex-col p-8">
        <h1>Тавтай морилно уу!</h1>
        <div>
          <AttendanceToday/>
        </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export default function AboutPage() {
  const editorialBoard = [
    {
      name: "Dr. Mursali Mohammed Jaji",
      role: "Chairman",
      affiliation: "Federal College Education (Technical), Potiskum, Yobe State. Nigeria",
      phone: "+2347035165583",
      designation: "Chief Lecturer"
    },
    {
      name: "Dr. Joseph Olorunmolu Oye",
      role: "Member",
      affiliation: "Federal College Education (Technical), Potiskum, Yobe State. Nigeria",
      phone: "+2348037935506",
      designation: "Chief Lecturer"
    },
    {
      name: "Dr. Ahmadu Bukar",
      role: "Member",
      affiliation: "Federal College Education (Technical), Potiskum, Yobe State. Nigeria",
      phone: "+2348032577688",
      designation: "Principal Lecturer"
    },
    {
      name: "Dr. Monday Usman",
      role: "Member",
      affiliation: "Federal College Education (Technical), Potiskum, Yobe State. Nigeria",
      phone: "+2348065704224",
      designation: "Chief Lecturer"
    },
    {
      name: "Dr. Ekaria Joseph",
      role: "Member",
      affiliation: "Federal College Education (Technical), Potiskum, Yobe State. Nigeria",
      phone: "+2348039652865",
      designation: "Chief Lecturer"
    },
    {
      name: "Dr. Babayo Shanga",
      role: "Member",
      affiliation: "Federal College Education (Technical), Potiskum, Yobe State. Nigeria",
      phone: "+2348067246198",
      designation: "Principal Lecturer"
    },
    {
      name: "Dr. (Mrs) Amina Hassan",
      role: "Member",
      affiliation: "Federal College Education (Technical), Potiskum, Yobe State. Nigeria",
      phone: "+2348035166425",
      designation: "Principal Lecturer"
    },
    {
      name: "Mrs. Rakiya Baba Zakariyya",
      role: "Member",
      affiliation: "Federal College Education (Technical), Potiskum, Yobe State. Nigeria",
      phone: "+2348064862042",
      designation: "Principal Lecturer"
    },
    {
      name: "Babayo Wakili",
      role: "Member",
      affiliation: "Federal College Education (Technical), Potiskum, Yobe State. Nigeria",
      phone: "+2348065455637",
      designation: "Senior Lecturer"
    },
    {
      name: "Benjamin Gbeyoron",
      role: "Member",
      affiliation: "Federal College Education (Technical), Potiskum, Yobe State. Nigeria",
      phone: "+2347037700025",
      designation: "Lecturer I"
    },
    {
      name: "Ahmed Maina",
      role: "Member",
      affiliation: "Federal College Education (Technical), Potiskum, Yobe State. Nigeria",
      phone: "+2348036025570",
      designation: "Lecturer I"
    },
    {
      name: "Dr. Abdulkadir Abdulkarim Olatunji",
      role: "Secretary",
      affiliation: "Federal College Education (Technical), Potiskum, Yobe State. Nigeria",
      phone: "+2348162872840",
      designation: "Lecturer I"
    },
  ];

  return (
    <div className="container py-12 space-y-12">
      {/* Introduction */}
      <section className="space-y-4 max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight">About JITTED</h1>
        <p className="text-lg text-slate-700 leading-relaxed">
          The <strong>Journal of Issues in Technical Teacher Education (JITTED)</strong> is a reputable academic journal 
          published by the Directorate of Research, Innovation and Development at the Federal College of 
          Education (Technical), Potiskum, Yobe State, Nigeria.
        </p>
        <p className="text-lg text-slate-700 leading-relaxed">
          Our mission is to advance knowledge through the publication of high-quality, peer-reviewed research 
          in the fields of Science, Vocational, and Technology Teacher Education. We accept original theoretical 
          and empirical articles that contribute to contemporary issues, innovations, inventions, and discoveries.
        </p>
      </section>

      {/* Editorial Board */}
      <section>
        <h2 className="text-3xl font-bold tracking-tight mb-8 border-b pb-2">Editorial Board & Committee</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {editorialBoard.map((member, index) => (
            <Card key={index} className="bg-slate-50 border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">{member.name}</CardTitle>
                  <p className="text-sm text-primary font-medium">{member.role}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-slate-700 font-medium">{member.affiliation}</p>
                {member.designation && (
                   <p className="text-sm text-slate-500">Designation: {member.designation}</p>
                )}
                {member.phone && (
                   <p className="text-sm text-slate-500">Mobile: {member.phone}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

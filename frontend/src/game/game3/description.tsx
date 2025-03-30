import des from "../../assets/temp/game3.png"; // adjust if it's .webp, .jpg, etc.
import Stepper from "../../shared/stepper/stepper.component";

export default function Description1() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-10 max-w-3xl w-full text-center space-y-8">
        <h1 className="text-4xl font-extrabold text-blue-400 drop-shadow">Trò chơi 3: Khám phá bí ẩn</h1>

        <img src={des} alt="Khám phá bí ẩn preview" className="rounded-xl w-full max-w-md mx-auto shadow-lg border border-white/20" />

        <p className="text-lg text-slate-100 leading-relaxed">
          Người chơi sẽ tương tác để hé lộ một tờ giấy bị vo vụn. Khi các mảnh dần mở ra, họ sẽ khám phá ra phần thưởng bí mật ở bên trong.
        </p>

        <Stepper previewLink="../game2" nextLink="../game4" />
      </div>
    </div>
  );
}

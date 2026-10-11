import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Setup Gemini SDK if API key is provided
  const ai = process.env.GEMINI_API_KEY
    ? new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  // Spring ChatBot AI Knowledge Prompt
  const SYSTEM_INSTRUCTION = `Bạn là "Spring ChatBot" - Trợ lý AI chính thức và thông minh của nền tảng VIETVI (Marketplace Sinh Viên Việt Nam).
Mục tiêu của bạn là đồng hành, giải đáp mọi thắc mắc và hướng dẫn người dùng khai thác tối đa mọi tính năng trên nền tảng VIETVI.

KIẾN THỨC VỀ VIETVI BẠN CẦN NẮM VỮNG:
1. Bản chất VIETVI: Nền tảng kết nối hai chiều (Peer-to-Peer) giữa Người yêu cầu (Requester) và Người thực hiện (Tasker) dành riêng cho cộng đồng sinh viên các trường đại học tại Việt Nam (Bách Khoa HUST, Ngoại Thương FTU, Kinh Tế Quốc Dân NEU, Công Nghệ UET, Bách Khoa HCMUT, UEH, UIT...).
2. Cơ chế Ký quỹ Escrow 100%: 
   - Khi giao việc, Người yêu cầu nạp tiền thù lao vào Escrow để sàn tạm giữ an toàn 100%.
   - Người thực hiện yên tâm làm bài vì tiền đã được bảo chứng, không sợ bị bùng tiền.
   - Khi Người thực hiện nộp bài và Người yêu cầu kiểm tra hài lòng (hoặc hết 48h nghiệm thu tự động), sàn mới giải ngân cho Người thực hiện.
3. Chính sách Phí sàn & Tài chính:
   - Phí sàn hiện tại: 0% dành trọn vẹn cho sinh viên (hoàn toàn miễn phí).
   - Nạp tiền: Hỗ trợ Chuyển khoản QR ngân hàng, VNPay, Ví MoMo.
   - Rút tiền: Hạn mức rút tối thiểu 50.000 VNĐ về tài khoản ngân hàng chính chủ hoặc ví điện tử (thời gian xử lý từ 15 - 30 phút).
4. Xác thực Sinh viên (Tick xanh KYC):
   - Sinh viên nộp ảnh thẻ sinh viên và email trường đuôi .edu.vn.
   - Chuyên viên Vận hành (Staff Ops) thẩm định và cấp huy hiệu Tick xanh trong vòng 2 giờ.
   - Lợi ích: Tăng 3.5x tỷ lệ được giao việc, tăng độ uy tín, mở khóa các Task ngân sách cao (> 1 triệu VNĐ).
5. Phân quyền và Vai trò:
   - Khách (Guest): Tự do khám phá sàn, xem các bài đăng công khai. Cần đăng nhập OTP để đăng việc hoặc báo giá.
   - Sinh viên / User: 1 tài khoản linh hoạt chuyển đổi cả 2 vai trò: Người yêu cầu (Requester) và Người thực hiện (Tasker).
   - Chuyên viên Vận hành (Staff Ops): Trực ca tiền tuyến, duyệt thẻ sinh viên KYC, hòa giải tranh chấp sơ thẩm (Mediation) và hỗ trợ ticket CSKH.
   - Quản trị viên (Super Admin): Tối cao pháp viện, chung thẩm các ca tranh chấp leo thang (Supreme Ruling), quản lý nhân sự Staff, thiết lập biểu phí và chính sách sàn.
6. Xử lý Tranh chấp:
   - Hòa giải sơ thẩm (Staff): Trong vòng 24h lắng nghe 2 bên, xem bằng chứng và ra phán quyết (Hoàn tiền Requester, Trả Tasker, hoặc chia 50/50).
   - Nếu có yếu tố phức tạp hoặc gian lận: Staff bấm "Chuyển cấp lên Admin" để Super Admin ra phán quyết chung thẩm cuối cùng.
7. Liêm chính học thuật (Academic Integrity):
   - Nghiêm cấm mọi hành vi thi hộ, làm bài kiểm tra hộ, sao chép gian lận trái quy định trường.
   - Chỉ khuyến khích các micro-task học thuật hợp lệ: thiết kế slide thuyết trình Canva/PowerPoint, viết code thuật toán/website, cào dữ liệu, xử lý số liệu Excel/SPSS, dịch thuật tài liệu tiếng Anh, gia sư 1-kèm-1.

PHONG CÁCH TRẢ LỜI CỦA SPRING CHATBOT:
- Xưng hô thân thiện, lịch thiệp, thông minh, mang phong cách sinh viên hiện đại ("Chào bạn", "Mình là Spring ChatBot", "Bạn thân mến").
- Câu trả lời rõ ràng, có chia đề mục hoặc gạch đầu dòng ngắn gọn, súc tích, dễ hiểu.
- Luôn khuyến khích và hướng dẫn cụ thể cách thao tác trên giao diện.`;

  // Spring ChatBot API Endpoint
  app.post('/api/spring-chat', async (req, res) => {
    const message = typeof req.body?.message === 'string' ? req.body.message : '';
    const history = Array.isArray(req.body?.history) ? req.body.history : [];

    if (!message) {
      res.status(400).json({ error: 'Tin nhắn không hợp lệ.' });
      return;
    }

    try {
      if (!ai) {
        // Fallback response if API key is not configured in environment
        res.json({
          reply: `Chào bạn! Mình là Spring ChatBot - Trợ lý AI của VIETVI. 

Về câu hỏi của bạn: "${message}":
VIETVI áp dụng cơ chế Ký quỹ Escrow 100% giúp bảo vệ an toàn thù lao cho sinh viên với 0% phí sàn. Bạn có thể dễ dàng đăng việc, gửi báo giá, hoặc xác thực thẻ sinh viên để nhận huy hiệu Tick xanh uy tín ngay trên thanh điều hướng!

Nếu bạn cần hỗ trợ thêm, hãy thử các gợi ý bên dưới nhé!`,
          source: 'local-knowledge',
        });
        return;
      }

      // Format past conversation if provided
      const contents: any[] = [];
      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          contents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }],
          });
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const replyText = response.text || 'Rất tiếc, mình chưa thể xử lý câu trả lời lúc này. Bạn vui lòng thử lại nhé!';
      res.json({ reply: replyText, source: 'gemini-3.8-flash' });
    } catch (error: any) {
      console.warn('Gemini Spring ChatBot Error (Using fallback knowledge):', error?.message || error);

      const q = message.toLowerCase();
      let fallbackText = `Chào bạn! Mình là Spring ChatBot - Trợ lý AI của VIETVI. 🌱\n\n`;

      if (q.includes('escrow') || q.includes('ký quỹ') || q.includes('an toàn') || q.includes('bảo vệ')) {
        fallbackText += `🛡️ **Cơ chế Ký quỹ Escrow 100% tại VIETVI:**\n- Khi Người yêu cầu duyệt báo giá, số tiền thù lao được khóa an toàn trong hệ thống ký quỹ.\n- Người thực hiện yên tâm làm bài vì tiền đã được bảo chứng 100%, không lo bùng thù lao.\n- Chỉ khi Người yêu cầu nhận sản phẩm và bấm "Nghiệm thu hài lòng" (hoặc sau 48h tự động giải ngân), tiền mới chuyển về ví của Người thực hiện.\n- Nếu có vi phạm hoặc không bàn giao, sàn sẽ hoàn tiền 100% cho Người yêu cầu.`;
      } else if (q.includes('phí') || q.includes('rút') || q.includes('nạp') || q.includes('tiền')) {
        fallbackText += `💸 **Chính sách Phí sàn & Rút tiền:**\n- Phí sàn: **0%** dành riêng cho sinh viên (hoàn toàn miễn phí, nhận trọn 100% thù lao).\n- Hạn mức rút tiền tối thiểu: **50.000 VNĐ**.\n- Thời gian xử lý rút về ngân hàng/MoMo: từ **15 - 30 phút**.`;
      } else if (q.includes('đăng') || q.includes('tạo task')) {
        fallbackText += `📝 **Quy trình Đăng Task mới:**\n1. Nhập tiêu đề, mô tả kết quả nghiệm thu cụ thể và ngân sách (từ 50.000đ trở lên).\n2. Khóa quỹ Escrow bảo chứng.\n3. Nhận báo giá cạnh tranh từ các bạn sinh viên giỏi chỉ sau 15 phút!`;
      } else if (q.includes('tick xanh') || q.includes('xác thực') || q.includes('thẻ')) {
        fallbackText += `🎓 **Huy hiệu Tick xanh Sinh viên (KYC):**\n- Giúp tăng 3.5x cơ hội nhận việc và mở khóa các Task ngân sách cao.\n- Bạn chỉ cần gửi ảnh thẻ sinh viên và email trường .edu.vn, chuyên viên Staff Ops sẽ thẩm định trong 2 giờ.`;
      } else if (q.includes('tranh chấp') || q.includes('khiếu nại') || q.includes('hòa giải')) {
        fallbackText += `⚖️ **Quy trình Xử lý Tranh chấp:**\n- Chuyên viên Vận hành (Staff Ops) tiếp nhận và hòa giải sơ thẩm trong vòng 24 giờ.\n- Các trường hợp phức tạp được leo thang lên Super Admin để ra phán quyết chung thẩm cuối cùng.`;
      } else {
        fallbackText += `VIETVI là nền tảng kết nối việc làm micro-task hai chiều minh bạch dành riêng cho sinh viên Việt Nam, bảo chứng Escrow 100% và 0% phí sàn. Bạn có thể tự do đăng việc, nhận việc, nạp rút tiền hoặc trao đổi trong không gian an toàn!`;
      }

      res.json({
        reply: fallbackText,
        source: 'spring-ai-knowledge',
      });
    }
  });

  // Mount Vite middleware in development
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[VIETVI] Full-stack Server running with Spring ChatBot on http://0.0.0.0:${PORT}`);
  });
}

startServer();

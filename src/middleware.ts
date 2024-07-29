import { NextRequest } from "next/server";
import { withLogin } from "./middlewares/withLogin";
import { withAdmin } from "./middlewares/withAdmin";
import { authAccess } from "./middlewares/authAccess";

export const middleware = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname;
  if (pathname.split("/")[1] === "admin") return await withAdmin(req);
  if (pathname.split("/")[1] === "auth") return await authAccess(req);
  if (pathname.split("/")[1] === "member") return await withLogin(req);
  if (
    pathname.split("/")[1] === "cart" ||
    pathname.split("/")[1] === "checkout"
  )
    return await withLogin(req);
};

export const config = {
  matchers: ["/"],
};

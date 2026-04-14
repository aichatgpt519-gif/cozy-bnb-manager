import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const results: string[] = [];

  // Create admin
  const { data: adminData, error: adminErr } = await supabase.auth.admin.createUser({
    email: "admin@grandhaven.com",
    password: "Admin@123",
    email_confirm: true,
    user_metadata: { full_name: "Admin User" },
  });
  if (adminErr && !adminErr.message.includes("already been registered")) {
    results.push(`Admin error: ${adminErr.message}`);
  } else if (adminData?.user) {
    // Assign admin role
    await supabase.from("user_roles").insert({ user_id: adminData.user.id, role: "admin" });
    results.push(`Admin created: ${adminData.user.id}`);
  } else {
    results.push("Admin already exists");
  }

  // Create regular user
  const { data: userData, error: userErr } = await supabase.auth.admin.createUser({
    email: "user@grandhaven.com",
    password: "User@123",
    email_confirm: true,
    user_metadata: { full_name: "John Guest" },
  });
  if (userErr && !userErr.message.includes("already been registered")) {
    results.push(`User error: ${userErr.message}`);
  } else if (userData?.user) {
    results.push(`User created: ${userData.user.id}`);
  } else {
    results.push("User already exists");
  }

  return new Response(JSON.stringify({ results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

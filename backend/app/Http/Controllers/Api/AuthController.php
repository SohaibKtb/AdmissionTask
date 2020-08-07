<?php

namespace App\Http\Controllers\Api;

use App\User;
use Exception;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }


    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|exists:users',
                'password' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => 'Email Does Not Exists']);
            }

            if ($token = $this->guard('api')->attempt($credentials)) {
                return $this->respondWithToken($token);
            }
            return response()->json(['error' => 'Unauthorized'], 401);
        }catch (Exception $e){
            return response()->json(['message' => $e->getMessage()], 401);
        }
    }

    public function register(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email|string|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $password = Hash::make($request->password);
        try {

            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => $password,
                'role' => $request->role,
                'account_type' => $request->account_type,
            ]);

        } catch (Exception $e) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
            $credentials = [
                'email' => $user->email,
                'password' => $request->password
            ];

            if ($token = $this->guard('api')->attempt($credentials)) {
                return response()->json(['success' => "User registered successfully", "access_token" => $token]);
            }else{
                return response()->json(['error' => "some error occurred"]);
            }
    }

    public function me()
    {
        return response()->json($this->guard('api')->user());
    }

    public function logout()
    {
        $this->guard('api')->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    public function refresh()
    {
        return $this->respondWithToken($this->guard('api')->refresh());
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => $this->guard('api')->factory()->getTTL() * 60
        ]);
    }

    public function guard($type)
    {
        return Auth::guard($type);
    }
}

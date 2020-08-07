<?php

namespace App\Http\Controllers;

use App\User;
use Exception;

class UserController extends Controller
{
    public function index()
    {
        try {
            $users = User::where('id', '!=', auth()->id())->get();
            $users->sortByDesc('created_at');
            return response()->json(['users' => $users]);
        }catch (Exception $e){
            return response()->json(['error' => $e->getMessage()]);
        }
    }
}
